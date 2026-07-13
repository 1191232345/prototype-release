export function extractSummary(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    for (const raw of lines) {
        const line = raw.trim();
        if (!line.startsWith('>'))
            continue;
        const content = line.replace(/^>\s*/, '').trim();
        const oneLiner = content.match(/^\*\*一句话[：:]\*\*\s*(.+)$/);
        if (oneLiner)
            return oneLiner[1].trim();
        if (content && !content.startsWith('本文档由'))
            return content.replace(/\*\*/g, '').trim();
    }
    return '';
}
export function extractKpis(markdown) {
    const summary = extractSummary(markdown);
    const kpis = [];
    const threshold = markdown.match(/(?:阈值|低于)\s*(\d+\s*件|<\s*\d+\s*件)/);
    if (threshold) {
        kpis.push({
            value: threshold[1].replace(/\s+/g, ' '),
            label: '预警阈值',
            icon: 'triangle-exclamation',
        });
    }
    const grace = markdown.match(/(\d+\s*个月)[^。\n]*(?:不再|免)/);
    if (grace) {
        kpis.push({
            value: grace[1],
            label: '免重复盘点周期',
            icon: 'calendar-check',
        });
    }
    const steps = markdown.match(/(\d+)\s*步/);
    if (steps && summary.includes('→')) {
        kpis.push({
            value: `${steps[1]} 步闭环`,
            label: summary.split('→').map((s) => s.trim()).filter(Boolean).slice(0, 3).join(' → ') || '业务流程',
            icon: 'arrows-rotate',
        });
    }
    return kpis.slice(0, 3);
}
