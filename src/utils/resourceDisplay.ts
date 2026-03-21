const MAX_LABEL_LENGTH = 32;

const shortenLabel = (label: string, maxLength = MAX_LABEL_LENGTH): string => {
    const normalizedLabel = label.trim();

    if (!normalizedLabel) {
        return '';
    }

    if (normalizedLabel.length <= maxLength) {
        return normalizedLabel;
    }

    const extensionMatch = normalizedLabel.match(/(\.[a-z0-9]{2,8})$/i);
    if (extensionMatch) {
        const extension = extensionMatch[1];
        const visibleLength = Math.max(12, maxLength - extension.length - 3);
        return `${normalizedLabel.slice(0, visibleLength)}...${extension}`;
    }

    return `${normalizedLabel.slice(0, maxLength - 3)}...`;
};

const getLastPathSegment = (value: string): string => {
    const normalizedValue = decodeURIComponent(value);
    return normalizedValue.split('/').filter(Boolean).pop() || '';
};

export const getCompactFileLabel = (resourceUrl?: string, fallbackLabel = 'Tai lieu'): string => {
    if (!resourceUrl) {
        return fallbackLabel;
    }

    try {
        const parsedUrl = new URL(resourceUrl);
        const pathSegment = getLastPathSegment(parsedUrl.pathname || '');
        const hostname = parsedUrl.hostname.replace(/^www\./, '');
        return shortenLabel(pathSegment || hostname || fallbackLabel);
    } catch {
        return shortenLabel(getLastPathSegment(resourceUrl) || resourceUrl || fallbackLabel);
    }
};

export const getCompactLinkLabel = (resourceUrl?: string, fallbackLabel = 'Mo lien ket'): string => {
    if (!resourceUrl) {
        return fallbackLabel;
    }

    try {
        const parsedUrl = new URL(resourceUrl);
        const pathSegment = getLastPathSegment(parsedUrl.pathname || '');
        const hostname = parsedUrl.hostname.replace(/^www\./, '');
        const isFileLikePath = /\.[a-z0-9]{2,8}$/i.test(pathSegment);

        return shortenLabel(isFileLikePath ? pathSegment : hostname || pathSegment || fallbackLabel);
    } catch {
        return shortenLabel(resourceUrl || fallbackLabel);
    }
};
