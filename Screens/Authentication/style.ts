import { StyleSheet, Platform } from 'react-native';

export const theme = {
    colors: {
        text: "#f5f2e5",
        background: "#1a2b2b",
        contrast: "#545454",
        highlight: "#FFFFFF",
        primary: "#310b0b",
        error: "#FF6B6B",
        inactive: "#456565",
        success: "#28a745",
        
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
};

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: theme.spacing.xl,
        textAlign: "center",
        opacity: 0.8,
    },
    input: {
        width: "100%",
        height: 56,
        backgroundColor: theme.colors.contrast,
        borderRadius: 12,
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: "rgba(245, 242, 229, 0.1)",
    },
    primaryButton: {
        width: "100%",
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing.l,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: "bold",
    },
    linkText: {
        fontSize: 16,
        color: theme.colors.text,
        opacity: 0.8,
    },
    linkTextHighlight: {
        color: theme.colors.highlight,
        fontWeight: "bold",
    },
    error: {
        color: theme.colors.error,
        marginBottom: theme.spacing.l,
        fontSize: 14,
        textAlign: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginVertical: theme.spacing.xl,
    },
    success: {
        color: theme.colors.success,
        marginBottom: theme.spacing.l,
        fontSize: 14,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xl,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.l,
        paddingTop: Platform.OS === 'android' ? theme.spacing.xl : theme.spacing.m,
        paddingBottom: theme.spacing.m,
        backgroundColor: theme.colors.background,
        zIndex: 1,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    loginLink: {
        alignSelf: 'center',
        paddingVertical: theme.spacing.m,
    },
});