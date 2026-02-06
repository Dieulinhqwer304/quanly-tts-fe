import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#6366f1',
        colorInfo: '#6366f1',
        borderRadius: 8,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        colorBgContainer: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    components: {
        Button: {
            controlHeight: 40,
            boxShadow: 'none',
            primaryShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
        },
        Input: {
            controlHeight: 42,
            activeShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
        },
        Card: {
            borderRadiusLG: 16,
            boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        },
        Menu: {
            itemBorderRadius: 8,
            itemHeight: 45,
            itemMarginInline: 12
        },
        Table: {
            headerBg: '#f9fafb',
            headerColor: '#4b5563',
            headerSplitColor: 'transparent',
            rowHoverBg: '#f5f7ff'
        },
        Layout: {
            bodyBg: '#f3f4f6',
            siderBg: '#ffffff',
            headerBg: 'rgba(255, 255, 255, 0.8)'
        }
    }
};
