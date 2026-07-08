import fs from 'node:fs';
import path from 'node:path';
import { resolveProjectDir } from './delete-project-dir.mjs';

const SLUG_RE = /^[a-z0-9-]+$/;
const VERSION_RE = /^v\d+$/;

const REQUIREMENTS_CONFIRM_PHRASE = '需求理解正确，继续细化';
const CREATE_CONFIRM_PHRASE = '理解正确，继续创建';
const ITERATE_CONFIRM_PHRASE = '理解正确，继续迭代';

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function readTemplate(root, name) {
  const file = path.join(root, 'templates', name);
  if (!fs.existsSync(file)) {
    throw new Error(`缺少模板文件：templates/${name}`);
  }
  return fs.readFileSync(file, 'utf8');
}

function buildTemplateVars({ name, slug, version, platform }) {
  return {
    NAME: name,
    SLUG: slug,
    VERSION: version,
    PROJECT_KEY: `${slug}/${version}`,
    DIR: `prototypes/${slug}/${version}`,
    TODAY: todayIsoDate(),
    REQUIREMENTS_CONFIRM_PHRASE,
    CREATE_CONFIRM_PHRASE,
    ITERATE_CONFIRM_PHRASE,
    REFERENCE_PROJECT: platform === 'mobile' ? 'sku-信息填充-pda/v1' : 'rule-config/v1',
  };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function scaffoldPcPages(pagesDir, name) {
  writeJson(path.join(pagesDir, 'list.json'), {
    pattern: 'rule-config-list',
    title: `${name}列表`,
    filters: [],
    mainButtons: [
      {
        id: 'add',
        label: '新增',
        icon: 'fas fa-plus',
        variant: 'primary',
        action: 'navigateForm',
      },
    ],
    table: {
      columns: [{ key: 'name', label: '名称' }],
      rows: [],
    },
  });

  writeJson(path.join(pagesDir, 'form.json'), {
    pattern: 'rule-config-form',
    title: `创建${name}`,
    sections: [
      {
        id: 'basic',
        title: '基本信息',
        fields: [{ id: 'name', label: '名称', type: 'text', required: true }],
      },
    ],
    formActions: [
      { id: 'save', label: '暂存', variant: 'secondary' },
      { id: 'publish', label: '发布', variant: 'primary' },
    ],
  });
}

function scaffoldMobilePages(pagesDir, name) {
  writeJson(path.join(pagesDir, 'list.json'), {
    pattern: 'sku-fill-pda-list',
    title: name,
    pageMode: 'pda',
    mainButtons: [],
    header: { brand: 'ELSA PDA' },
    table: {
      columns: [
        { key: 'sku', label: 'SKU' },
        { key: 'orderNo', label: '工单号' },
        { key: 'status', label: '任务状态' },
      ],
      rows: [],
    },
  });

  writeJson(path.join(pagesDir, 'task.json'), {
    pattern: 'sku-fill-pda-task',
    title: `${name}任务`,
    pageMode: 'pda',
    header: { brand: 'ELSA PDA' },
    sections: [
      {
        id: 'basic',
        title: '任务信息',
        fields: [{ id: 'remark', label: '备注', type: 'textarea' }],
      },
    ],
    formActions: [{ id: 'submit', label: '提交', variant: 'primary' }],
  });
}

function scaffoldDocs(projectDir, root, vars, name, platform) {
  const createTemplate =
    platform === 'mobile'
      ? 'CREATE.mobile.prompt.template.md'
      : 'CREATE.prompt.template.md';

  fs.writeFileSync(
    path.join(projectDir, 'CREATE.prompt.md'),
    `${renderTemplate(readTemplate(root, createTemplate), vars)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(projectDir, 'ITERATE.prompt.md'),
    `${renderTemplate(readTemplate(root, 'ITERATE.prompt.template.md'), vars)}\n`,
    'utf8',
  );

  fs.writeFileSync(
    path.join(projectDir, 'CHANGELOG.md'),
    `# 变更记录 - ${name} ${vars.VERSION}\n\n## ${vars.TODAY}\n- 初始化项目骨架（待 AI 按 CREATE.prompt.md 补充业务内容）\n`,
    'utf8',
  );

  fs.writeFileSync(
    path.join(projectDir, 'REQUIREMENTS.md'),
    `# 需求文档 - ${name}\n\n## 现状\n\n（待补充）\n\n## 痛点\n\n（待补充）\n\n## 诉求与目标\n\n（待补充）\n\n## 范围边界\n\n### 做\n\n- （待补充）\n\n### 不做\n\n- （待补充）\n\n## 验收标准\n\n- [ ] （待补充）\n\n## 变更记录\n\n### ${vars.TODAY} · 初始化\n- 创建项目骨架\n`,
    'utf8',
  );

  const prdTemplate = readTemplate(root, 'PRD.template.md');
  fs.writeFileSync(
    path.join(projectDir, 'PRD.md'),
    prdTemplate.replace(/\{项目名称\}/g, name),
    'utf8',
  );
}

/**
 * 在 prototypes/{slug}/{version}/ 创建项目骨架
 */
export function scaffoldProject(root, input) {
  const name = String(input.name || '').trim();
  const slug = String(input.slug || '').trim();
  const version = String(input.version || 'v1').trim();
  const platform = input.platform === 'mobile' ? 'mobile' : 'pc';

  if (!name) {
    return { ok: false, error: '请填写项目名称' };
  }
  if (!SLUG_RE.test(slug)) {
    return { ok: false, error: 'slug 无效，请使用英文小写、数字与连字符' };
  }
  if (!VERSION_RE.test(version)) {
    return { ok: false, error: 'version 无效，应为 v1、v2 等格式' };
  }

  const projectKey = `${slug}/${version}`;
  const projectDir = resolveProjectDir(root, projectKey);
  if (!projectDir) {
    return { ok: false, error: '无效的项目目录' };
  }
  if (fs.existsSync(projectDir)) {
    return { ok: false, error: `项目目录已存在：prototypes/${projectKey}` };
  }

  const vars = buildTemplateVars({ name, slug, version, platform });
  const pages = platform === 'mobile' ? ['list', 'task'] : ['list', 'form'];

  fs.mkdirSync(path.join(projectDir, 'pages'), { recursive: true });

  writeJson(path.join(projectDir, 'flow.json'), {
    type: 'flow',
    title: name,
    entry: 'list',
    header: { brand: platform === 'mobile' ? 'ELSA PDA' : 'ELSA' },
    pages,
  });

  writeJson(path.join(projectDir, 'meta.json'), {
    id: slug,
    version,
    title: name,
    project: slug,
    type: 'flow',
    mode: 'spec',
    designSystem: platform === 'mobile' ? 'elsa-pda' : 'elsa-enterprise',
    author: '待填写',
    createdAt: vars.TODAY,
    changeSummary: '初始化项目骨架，待 AI 补充业务内容',
    status: 'draft',
  });

  if (platform === 'mobile') {
    scaffoldMobilePages(path.join(projectDir, 'pages'), name);
  } else {
    scaffoldPcPages(path.join(projectDir, 'pages'), name);
  }

  scaffoldDocs(projectDir, root, vars, name, platform);

  return {
    ok: true,
    projectKey,
    projectDir: `prototypes/${projectKey}`,
  };
}
