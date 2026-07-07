export const FORM_PAGE_RECOMMENDED_ANCHORS = [
    'form.init',
    'form.fields',
    'form.surcharge-table',
    'form.main-buttons',
];
export const FORM_WAREHOUSE_SPLIT_ANCHORS = [
    'form.warehouse-split',
    'form.quick-fill',
    'form.fee-nav',
];
export const FORM_ZONE_TABLE_ANCHORS = [
    'form.zone-table',
    'form.zone-buttons',
    'form.zone-import-modal',
];
export const FORM_SURCHARGE_TABLE_ANCHORS = [
    'form.surcharge-table',
    'form.surcharge-buttons',
    'form.surcharge-import-modal',
];
export const LIST_PAGE_RECOMMENDED_ANCHORS = [
    'list.init',
    'list.filters',
    'list.columns',
    'list.main-buttons',
    'list.row-buttons',
];
export function deriveListPageExpectations(page) {
    const out = [];
    const isPda = page.pageMode === 'pda';
    for (const f of page.filters ?? []) {
        out.push({
            reviewId: `list.filter.${f.id}`,
            anchorId: 'list.filters',
            rowLabel: f.label,
            source: `filter.${f.id}`,
        });
    }
    if (!isPda) {
        out.push({
            reviewId: 'list.filter.search',
            anchorId: 'list.filters',
            rowLabel: '查询',
            source: 'filter.search',
        }, {
            reviewId: 'list.filter.reset',
            anchorId: 'list.filters',
            rowLabel: '重置',
            source: 'filter.reset',
        });
    }
    const buttons = page.mainButtons !== undefined
        ? page.mainButtons
        : isPda
            ? []
            : [{ id: 'add', label: '新增' }];
    for (const btn of buttons) {
        out.push({
            reviewId: `list.btn.${btn.id}`,
            anchorId: 'list.main-buttons',
            rowLabel: btn.label,
            source: `mainButton.${btn.id}`,
        });
    }
    for (const col of page.table?.columns ?? []) {
        if (col.key === 'actions')
            continue;
        out.push({
            reviewId: `list.col.${col.key}`,
            anchorId: 'list.columns',
            rowLabel: col.label,
            source: `column.${col.key}`,
        });
    }
    if (page.table?.selectable) {
        out.push({
            reviewId: 'list.selectable',
            anchorId: 'list.init',
            rowLabel: '行勾选',
            source: 'table.selectable',
        });
    }
    if (page.importModal) {
        const modal = page.importModal;
        const isWorkOrder = Boolean(modal.workOrderImportPreview);
        out.push({
            reviewId: 'list.import.file',
            anchorId: 'list.import-modal',
            rowLabel: isWorkOrder ? '工单导入 Excel' : '承运商账单 Excel',
            source: 'importModal.file',
        }, {
            reviewId: 'list.import.btn.confirm-import',
            anchorId: 'list.import-modal',
            rowLabel: '确认导入',
            source: 'importModal.confirm-import',
        });
        if (isWorkOrder) {
            out.push({
                reviewId: 'list.import.btn.template',
                anchorId: 'list.import-modal',
                rowLabel: '下载模板',
                source: 'importModal.template',
            }, {
                reviewId: 'list.import.preview-table',
                anchorId: 'list.import-modal',
                rowLabel: '导入预览表',
                source: 'importModal.preview-table',
            }, {
                reviewId: 'list.import.btn.confirm-create',
                anchorId: 'list.import-modal',
                rowLabel: '确认创建',
                source: 'importModal.confirm-create',
            });
        }
        else {
            out.push({
                reviewId: 'list.import.btn.confirm-calc',
                anchorId: 'list.import-modal',
                rowLabel: '确认并计算差价',
                source: 'importModal.confirm-calc',
            });
        }
    }
    return out;
}
export function deriveFormPageExpectations(page) {
    const out = [];
    out.push({
        reviewId: 'form.back',
        anchorId: 'form.main-buttons',
        rowLabel: '返回列表',
        source: 'form.back',
    });
    for (const section of page.sections ?? []) {
        for (const field of section.fields ?? []) {
            out.push({
                reviewId: `form.field.${field.id}`,
                anchorId: 'form.fields',
                rowLabel: field.label,
                source: `field.${field.id}`,
            });
        }
        if (section.zonePriceTable) {
            out.push({
                reviewId: 'form.zone.table',
                anchorId: 'form.zone-table',
                source: 'zonePriceTable',
            }, {
                reviewId: 'form.zone.btn.add',
                anchorId: 'form.zone-buttons',
                rowLabel: '添加重量段',
                source: 'zoneButton.add',
            }, {
                reviewId: 'form.zone.btn.import',
                anchorId: 'form.zone-buttons',
                rowLabel: '导入分区报价',
                source: 'zoneButton.import',
            }, {
                reviewId: 'form.zone.btn.export',
                anchorId: 'form.zone-buttons',
                rowLabel: '导出表格',
                source: 'zoneButton.export',
            }, {
                reviewId: 'form.zone.import.file',
                anchorId: 'form.zone-import-modal',
                rowLabel: '文件上传区',
                source: 'zoneImport.file',
            }, {
                reviewId: 'form.zone.import.btn.cancel',
                anchorId: 'form.zone-import-modal',
                rowLabel: '取消',
                source: 'zoneImport.cancel',
            }, {
                reviewId: 'form.zone.import.btn.confirm',
                anchorId: 'form.zone-import-modal',
                rowLabel: '开始导入',
                source: 'zoneImport.confirm',
            });
        }
        if (section.surchargeTable) {
            out.push({
                reviewId: 'form.surcharge.table',
                anchorId: 'form.surcharge-table',
                source: 'surchargeTable',
            }, {
                reviewId: 'form.surcharge.btn.add',
                anchorId: 'form.surcharge-buttons',
                rowLabel: '添加行',
                source: 'surchargeButton.add',
            }, {
                reviewId: 'form.surcharge.btn.import',
                anchorId: 'form.surcharge-buttons',
                rowLabel: '导入',
                source: 'surchargeButton.import',
            }, {
                reviewId: 'form.surcharge.import.file',
                anchorId: 'form.surcharge-import-modal',
                rowLabel: '文件上传区',
                source: 'surchargeImport.file',
            }, {
                reviewId: 'form.surcharge.import.btn.cancel',
                anchorId: 'form.surcharge-import-modal',
                rowLabel: '取消',
                source: 'surchargeImport.cancel',
            }, {
                reviewId: 'form.surcharge.import.btn.confirm',
                anchorId: 'form.surcharge-import-modal',
                rowLabel: '开始导入',
                source: 'surchargeImport.confirm',
            });
        }
        if (section.layout === 'sku-line-table') {
            out.push({
                reviewId: 'form.sku.line.table',
                anchorId: 'form.sku-line-table',
                rowLabel: 'SKU 列表',
                source: 'skuLineTable',
            }, {
                reviewId: 'form.field.skus',
                anchorId: 'form.fields',
                rowLabel: 'SKU',
                source: 'field.skus',
            }, {
                reviewId: 'form.sku.btn.add',
                anchorId: 'form.sku-line-buttons',
                rowLabel: '新增一行',
                source: 'skuButton.add',
            }, {
                reviewId: 'form.sku.btn.remove',
                anchorId: 'form.sku-line-buttons',
                rowLabel: '删除行',
                source: 'skuButton.remove',
            });
        }
    }
    if (page.warehouseOptions?.length) {
        out.push({
            reviewId: 'form.warehouse.sidebar',
            anchorId: 'form.warehouse-split',
            rowLabel: '仓库列表',
            source: 'warehouse.sidebar',
        }, {
            reviewId: 'form.warehouse.search',
            anchorId: 'form.warehouse-split',
            rowLabel: '搜索仓库',
            source: 'warehouse.search',
        }, {
            reviewId: 'form.warehouse.fees',
            anchorId: 'form.warehouse-split',
            rowLabel: '费用配置区',
            source: 'warehouse.fees',
        }, {
            reviewId: 'form.fee.toolbar',
            anchorId: 'form.quick-fill',
            rowLabel: '快速填入',
            source: 'fee.toolbar',
        }, {
            reviewId: 'form.fill.mode.template',
            anchorId: 'form.quick-fill',
            rowLabel: '价卡模板',
            source: 'fill.mode.template',
        }, {
            reviewId: 'form.fill.mode.warehouse',
            anchorId: 'form.quick-fill',
            rowLabel: '复用仓库',
            source: 'fill.mode.warehouse',
        }, {
            reviewId: 'form.fill.apply',
            anchorId: 'form.quick-fill',
            rowLabel: '应用',
            source: 'fill.apply',
        });
    }
    const hasFeeCategoryNav = (page.sections ?? []).filter((s) => s.title.includes('快递费') ||
        s.title.includes('库内费用') ||
        s.title.includes('其他费用配置')).length >= 2;
    if (hasFeeCategoryNav) {
        out.push({
            reviewId: 'form.fee.nav',
            anchorId: 'form.fee-nav',
            rowLabel: '费用导航',
            source: 'fee.nav',
        }, {
            reviewId: 'form.fee.sub.tabs',
            anchorId: 'form.fee-nav',
            rowLabel: '费用子类',
            source: 'fee.sub.tabs',
        });
    }
    for (const action of page.formActions ?? []) {
        const reviewId = action.label === '取消'
            ? 'form.btn.cancel'
            : action.label === '保存'
                ? 'form.btn.save'
                : action.label === '暂存'
                    ? 'form.btn.draft'
                    : action.label === '发布'
                        ? 'form.btn.publish'
                        : `form.btn.${action.label}`;
        out.push({
            reviewId,
            anchorId: 'form.main-buttons',
            rowLabel: action.label,
            source: `formAction.${action.label}`,
        });
    }
    return out;
}
