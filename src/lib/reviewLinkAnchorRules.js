const EXACT_RULES = [
    { id: 'list.table', anchorId: 'list.columns', keywords: ['列字段取值', '列表属性'] },
    { id: 'list.master-detail', anchorId: 'list.init', keywords: ['初始化', '分栏'] },
    { id: 'list.customer.sidebar', anchorId: 'list.init', keywords: ['客户列表'] },
    { id: 'list.customer.search', anchorId: 'list.init', keywords: ['搜索客户'] },
    { id: 'list.rules.panel', anchorId: 'list.columns', keywords: ['规则列表'] },
    { id: 'list.rules.filters', anchorId: 'list.filters', keywords: ['检索条件'] },
    { id: 'list.rules.toolbar', anchorId: 'list.main-buttons', keywords: ['主要按钮'] },
    { id: 'list.rules.header', anchorId: 'list.init', keywords: ['规则列表标题'] },
    { id: 'list.selectable', anchorId: 'list.init', keywords: ['初始化', '数据展示'] },
    { id: 'form.sku.line.table', anchorId: 'form.sku-line-table', keywords: ['SKU 列表'] },
    { id: 'detail.timeline', anchorId: 'detail.timeline', keywords: ['操作时间轴'] },
    { id: 'audit.timeline', anchorId: 'audit.timeline', keywords: ['操作时间轴'] },
    { id: 'pda.sku-form', anchorId: 'pda.sku-form', keywords: ['SKU 信息补充表单'] },
    { id: 'task.sku-form', anchorId: 'task.sku-form', keywords: ['SKU 信息补充表单'] },
    { id: 'task.instruction.sheet', anchorId: 'task.fill-instruction-modal', keywords: ['填写说明弹层'] },
    { id: 'form.surcharge.table', anchorId: 'form.surcharge-table', keywords: ['费用项表格'] },
    { id: 'form.other.table', anchorId: 'form.surcharge-table', keywords: ['费用项表格'] },
    { id: 'form.back', anchorId: 'form.main-buttons', keywords: ['主要按钮'] },
    { id: 'form.warehouse.fees', anchorId: 'form.warehouse-split', keywords: ['分仓费用配置'] },
    { id: 'form.fee.toolbar', anchorId: 'form.quick-fill', keywords: ['快速填入'] },
    { id: 'form.fee.nav', anchorId: 'form.fee-nav', keywords: ['费用导航'] },
    { id: 'form.fee.sub.tabs', anchorId: 'form.fee-nav', keywords: ['费用子类'] },
    { id: 'form.fill.apply', anchorId: 'form.quick-fill', keywords: ['应用'] },
    { id: 'form.publish.preview', anchorId: 'form.publish-preview', keywords: ['发布前影响预览'] },
];
const PREFIX_RULES = [
    { prefix: 'list.filter.', anchorId: 'list.filters', keywords: ['检索条件'] },
    { prefix: 'list.customer.item.', anchorId: 'list.init', keywords: ['客户项'] },
    { prefix: 'list.customer.', anchorId: 'list.init', keywords: ['客户列表'] },
    { prefix: 'list.rules.', anchorId: 'list.columns', keywords: ['规则列表'] },
    { prefix: 'list.col.', anchorId: 'list.columns', keywords: ['列字段取值', '列表属性'] },
    { prefix: 'list.action.', anchorId: 'list.row-buttons', keywords: ['列表按钮'] },
    { prefix: 'list.btn.', anchorId: 'list.main-buttons', keywords: ['主要按钮'] },
    { prefix: 'list.detail.', anchorId: 'list.detail-modal', keywords: ['详情弹窗'] },
    { prefix: 'detail.', anchorId: 'detail.init', keywords: ['详情页'] },
    { prefix: 'audit.', anchorId: 'audit.init', keywords: ['审核页'] },
    { prefix: 'pda.info.', anchorId: 'pda.info', keywords: ['工单信息展示'] },
    { prefix: 'pda.sku.', anchorId: 'pda.sku-form', keywords: ['SKU 信息补充表单'] },
    { prefix: 'pda.btn.', anchorId: 'pda.main-buttons', keywords: ['主要按钮说明'] },
    { prefix: 'pda.', anchorId: 'pda.init', keywords: ['PDA 端'] },
    { prefix: 'task.info.', anchorId: 'task.info', keywords: ['工单信息展示'] },
    { prefix: 'task.sku.', anchorId: 'task.sku-form', keywords: ['SKU 信息补充表单'] },
    { prefix: 'task.instruction.', anchorId: 'task.fill-instruction-modal', keywords: ['填写说明弹层'] },
    { prefix: 'task.btn.', anchorId: 'task.main-buttons', keywords: ['主要按钮说明'] },
    { prefix: 'task.', anchorId: 'task.init', keywords: ['PDA 端'] },
    { prefix: 'list.import.', anchorId: 'list.import-modal', keywords: ['导入弹窗'] },
    { prefix: 'form.warehouse.item.', anchorId: 'form.warehouse-split', keywords: ['仓库项'] },
    { prefix: 'form.warehouse.', anchorId: 'form.warehouse-split', keywords: ['分仓费用配置'] },
    { prefix: 'form.fill.', anchorId: 'form.quick-fill', keywords: ['快速填入'] },
    { prefix: 'form.import.', anchorId: 'form.quick-fill', keywords: ['快速填入'] },
    { prefix: 'form.reuse.', anchorId: 'form.quick-fill', keywords: ['快速填入'] },
    { prefix: 'form.fee.category.', anchorId: 'form.fee-nav', keywords: ['费用大类'] },
    { prefix: 'form.fee.', anchorId: 'form.fee-nav', keywords: ['费用导航'] },
    { prefix: 'form.publish.', anchorId: 'form.publish-preview', keywords: ['发布前影响预览'] },
    { prefix: 'form.zone.import.', anchorId: 'form.zone-import-modal', keywords: ['导入分区报价弹窗'] },
    { prefix: 'form.zone.btn.', anchorId: 'form.zone-buttons', keywords: ['分区报价', '主要按钮'] },
    { prefix: 'form.zone.', anchorId: 'form.zone-table', keywords: ['分区报价'] },
    { prefix: 'form.surcharge.import.', anchorId: 'form.surcharge-import-modal', keywords: ['导入附加费弹窗'] },
    { prefix: 'form.surcharge.btn.', anchorId: 'form.surcharge-buttons', keywords: ['附加费管理', '主要按钮'] },
    { prefix: 'form.surcharge.', anchorId: 'form.surcharge-table', keywords: ['附加费管理'] },
    { prefix: 'form.sku.btn.', anchorId: 'form.sku-line-buttons', keywords: ['SKU 列表按钮'] },
    { prefix: 'form.sku.', anchorId: 'form.sku-line-table', keywords: ['SKU 列表'] },
    { prefix: 'form.field.', anchorId: 'form.fields', keywords: ['表单字段'] },
    { prefix: 'form.btn.', anchorId: 'form.main-buttons', keywords: ['主要按钮'] },
];
const LEGACY_IMPORT_EXACT = new Set([
    'form.steps',
    'form.field.file',
    'form.parse-summary',
    'form.customer-price-table',
    'form.btn.confirm-import',
    'form.btn.confirm-calc',
]);
const LEGACY_IMPORT_PREFIXES = ['form.file-preset.', 'form.field.priceCard.'];
const LEGACY_IMPORT = {
    anchorId: 'list.import-modal',
    keywords: ['导入弹窗'],
};
const PAGE_FALLBACK_KEYWORDS = [
    { prefix: 'list.', keywords: ['列表页'] },
    { prefix: 'form.', keywords: ['表单页'] },
];
const ROW_HINT_EXACT = {
    'list.filter.search': '查询',
    'list.filter.reset': '重置',
    'list.selectable': '行勾选',
    'form.back': '返回列表',
    'form.btn.cancel': '取消',
    'form.btn.save': '保存',
    'form.btn.draft': '暂存',
    'form.btn.publish': '发布',
    'form.zone.btn.add': '添加重量段',
    'form.zone.btn.import': '导入分区报价',
    'form.zone.btn.export': '导出表格',
    'form.zone.import.file': '文件上传区',
    'form.zone.import.btn.cancel': '取消',
    'form.zone.import.btn.confirm': '开始导入',
    'form.surcharge.btn.add': '添加行',
    'form.surcharge.btn.import': '导入',
    'form.sku.btn.add': '新增一行',
    'form.sku.btn.remove': '删除行',
    'detail.back': '返回列表',
    'audit.back': '返回列表',
    'audit.btn.save': '保存修改',
    'audit.btn.return': '退回',
    'audit.btn.complete': '完结',
    'audit.btn.confirm-return': '确认退回',
    'audit.btn.confirm-complete': '确认完结',
    'pda.btn.saveDraft': '暂存',
    'pda.btn.submit': '提交',
    'pda.back': '返回列表',
    'task.back': '返回列表',
    'task.btn.saveDraft': '暂存',
    'task.btn.submit': '提交',
    'task.instruction.sheet': '填写说明',
    'task.instruction.confirm': '知道了',
    'form.surcharge.import.file': '文件上传区',
    'form.surcharge.import.btn.cancel': '取消',
    'form.surcharge.import.btn.confirm': '开始导入',
    'form.warehouse.sidebar': '仓库列表',
    'form.warehouse.search': '搜索仓库',
    'form.warehouse.fees': '费用配置区',
    'form.fee.toolbar': '快速填入',
    'form.fill.mode.template': '价卡模板',
    'form.fill.mode.warehouse': '复用仓库',
    'form.fill.apply': '应用',
    'form.fee.nav': '费用导航',
    'form.fee.sub.tabs': '费用子类',
    'form.publish.btn.cancel': '取消',
    'form.publish.btn.confirm': '确认发布',
    'form.btn.parse': '解析文件',
    'list.import.steps': '步骤 1 · 上传文件',
    'list.import.file': '承运商账单 Excel',
    'list.import.summary': '步骤 2 · 文件概览',
    'list.import.price-card-table': '客户价卡配置表',
    'list.import.btn.confirm-import': '确认导入',
    'list.import.btn.confirm-calc': '确认并计算差价',
    'list.import.btn.confirm-create': '确认创建',
    'list.import.btn.template': '下载模板',
    'list.import.preview-table': '导入预览表',
    'list.import.btn.cancel': '取消',
    'form.steps': '步骤 1 · 上传文件',
    'form.field.file': '承运商账单 Excel',
    'form.parse-summary': '步骤 2 · 文件概览',
    'form.customer-price-table': '客户价卡配置表',
    'form.btn.confirm-import': '确认导入',
    'form.btn.confirm-calc': '确认并计算差价',
};
export function isLegacyImportModalReviewId(reviewId) {
    if (LEGACY_IMPORT_EXACT.has(reviewId))
        return true;
    return LEGACY_IMPORT_PREFIXES.some((p) => reviewId.startsWith(p));
}
export function resolveReviewAnchor(reviewId) {
    const exact = EXACT_RULES.find((r) => r.id === reviewId);
    if (exact)
        return { anchorId: exact.anchorId, keywords: exact.keywords };
    if (isLegacyImportModalReviewId(reviewId)) {
        return { anchorId: LEGACY_IMPORT.anchorId, keywords: LEGACY_IMPORT.keywords };
    }
    const prefix = PREFIX_RULES.find((r) => reviewId.startsWith(r.prefix));
    if (prefix)
        return { anchorId: prefix.anchorId, keywords: prefix.keywords };
    for (const fb of PAGE_FALLBACK_KEYWORDS) {
        if (reviewId.startsWith(fb.prefix)) {
            return { anchorId: null, keywords: fb.keywords };
        }
    }
    return { anchorId: null, keywords: [] };
}
export function getTableRowHintFallback(reviewId) {
    if (ROW_HINT_EXACT[reviewId])
        return ROW_HINT_EXACT[reviewId];
    if (reviewId.startsWith('list.import.file-preset.'))
        return '步骤 1 · 上传文件';
    if (reviewId.startsWith('list.import.priceCard.'))
        return '价卡';
    if (reviewId.startsWith('form.field.priceCard.'))
        return '价卡';
    if (reviewId.startsWith('form.file-preset.'))
        return '步骤 1 · 上传文件';
    const detailBlock = reviewId.match(/^list\.detail\.(.+)$/)?.[1];
    if (detailBlock)
        return detailBlock;
    return undefined;
}
