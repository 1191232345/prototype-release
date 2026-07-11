import { jsx as _jsx } from "react/jsx-runtime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBan, faBars, faBook, faBookOpen, faBorderAll, faBoxes, faBullhorn, faBullseye, faCalculator, faCamera, faCheck, faCheckCircle, faCheckDouble, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faCircle, faClipboardCheck, faClipboardList, faClone, faCloudUploadAlt, faCodeBranch, faCog, faCoins, faCopy, faCrosshairs, faDesktop, faDownload, faEdit, faEllipsisH, faExchangeAlt, faExclamationCircle, faExclamationTriangle, faExternalLinkAlt, faEye, faFileAlt, faFileContract, faFileExcel, faFileImport, faFileInvoiceDollar, faFilter, faFolderOpen, faHandPointer, faHistory, faHourglassHalf, faImage, faInbox, faInfoCircle, faLayerGroup, faLightbulb, faLink, faListAlt, faListCheck, faListUl, faPen, faMagic, faMinus, faMinusCircle, faMobileAlt, faMousePointer, faPalette, faPaperPlane, faPencilAlt, faPlayCircle, faPlus, faRedo, faRobot, faRoad, faSave, faSearch, faSitemap, faSlidersH, faSpinner, faStar, faStream, faSyncAlt, faTable, faTag, faTimes, faTrash, faUndo, faUpload, faUsers, faWarehouse, faWindowMaximize, faCogs, } from '@fortawesome/free-solid-svg-icons';
const ICON_MAP = {
    'arrow-left': faArrowLeft,
    ban: faBan,
    bars: faBars,
    book: faBook,
    'book-open': faBookOpen,
    'border-all': faBorderAll,
    boxes: faBoxes,
    bullseye: faBullseye,
    bullhorn: faBullhorn,
    calculator: faCalculator,
    camera: faCamera,
    check: faCheck,
    'check-circle': faCheckCircle,
    'check-double': faCheckDouble,
    'chevron-down': faChevronDown,
    'chevron-left': faChevronLeft,
    'chevron-right': faChevronRight,
    'chevron-up': faChevronUp,
    circle: faCircle,
    'clipboard-check': faClipboardCheck,
    'clipboard-list': faClipboardList,
    clone: faClone,
    'cloud-upload-alt': faCloudUploadAlt,
    'code-branch': faCodeBranch,
    cog: faCog,
    cogs: faCogs,
    coins: faCoins,
    copy: faCopy,
    crosshairs: faCrosshairs,
    desktop: faDesktop,
    download: faDownload,
    edit: faEdit,
    'ellipsis-h': faEllipsisH,
    'exchange-alt': faExchangeAlt,
    'exclamation-circle': faExclamationCircle,
    'exclamation-triangle': faExclamationTriangle,
    'external-link-alt': faExternalLinkAlt,
    eye: faEye,
    'file-alt': faFileAlt,
    'file-contract': faFileContract,
    'file-excel': faFileExcel,
    'file-import': faFileImport,
    'file-invoice-dollar': faFileInvoiceDollar,
    filter: faFilter,
    'folder-open': faFolderOpen,
    'hand-pointer': faHandPointer,
    history: faHistory,
    'hourglass-half': faHourglassHalf,
    image: faImage,
    inbox: faInbox,
    'info-circle': faInfoCircle,
    'layer-group': faLayerGroup,
    lightbulb: faLightbulb,
    link: faLink,
    'list-alt': faListAlt,
    'list-check': faListCheck,
    'list-ul': faListUl,
    pen: faPen,
    magic: faMagic,
    minus: faMinus,
    'minus-circle': faMinusCircle,
    'mobile-alt': faMobileAlt,
    'mouse-pointer': faMousePointer,
    palette: faPalette,
    'paper-plane': faPaperPlane,
    'pencil-alt': faPencilAlt,
    'play-circle': faPlayCircle,
    plus: faPlus,
    redo: faRedo,
    robot: faRobot,
    road: faRoad,
    save: faSave,
    search: faSearch,
    sitemap: faSitemap,
    'sliders-h': faSlidersH,
    spinner: faSpinner,
    star: faStar,
    stream: faStream,
    'sync-alt': faSyncAlt,
    table: faTable,
    tag: faTag,
    times: faTimes,
    trash: faTrash,
    undo: faUndo,
    upload: faUpload,
    users: faUsers,
    warehouse: faWarehouse,
    'window-maximize': faWindowMaximize,
    'triangle-exclamation': faExclamationTriangle,
    'file-circle-exclamation': faExclamationCircle,
    'circle-exclamation': faExclamationCircle,
};
export function parseIconName(raw) {
    const token = raw.trim().split(/\s+/).find((part) => part.startsWith('fa-'));
    if (token)
        return token.slice(3);
    if (raw.startsWith('fa-'))
        return raw.slice(3);
    return raw.replace(/^fas?\s+/, '').trim();
}
export function resolveIcon(raw) {
    if (!raw)
        return null;
    const name = parseIconName(raw);
    return ICON_MAP[name] ?? null;
}
export function Icon({ icon, className = '', spin, ...rest }) {
    const def = resolveIcon(icon);
    if (!def)
        return null;
    return _jsx(FontAwesomeIcon, { icon: def, className: className, spin: spin, ...rest });
}
export function FaIcon({ className = '', spin, ...rest }) {
    const parts = className.split(/\s+/);
    const faSpin = spin ?? parts.includes('fa-spin');
    const iconToken = parts.find((p) => p.startsWith('fa-') && p !== 'fa-spin' && p !== 'fas');
    const styleClass = parts.filter((p) => p !== 'fas' && p !== 'fa-spin' && p !== iconToken).join(' ');
    if (!iconToken)
        return null;
    return _jsx(Icon, { icon: iconToken, className: styleClass, spin: faSpin, ...rest });
}
export { ICON_MAP };
