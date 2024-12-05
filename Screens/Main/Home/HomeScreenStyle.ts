import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a2b2b",
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        marginTop: 45,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#1e2525",
        justifyContent: "center",
        alignItems: "center",
    },
    userTextContainer: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: "condensed",
        color: "#f5f2e5",
    },
    userRole: {
        fontSize: 14,
        color: "#a51912",
        fontWeight: "semibold",
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 8,  // Reduzido devido ao mapa acima
    },
    menuItem: {
        alignItems: "center",
    },
    menuIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: "#1e2525",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    menuLabel: {
        color: "#f5f2e5",
        fontSize: 16,
        fontWeight: "500",
        marginTop: 4,
    },
    recentSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#f5f2e5",
    },
    seeAllButton: {
        color: "#a51912",
        fontSize: 16,
        fontWeight: "500",
    },
    routeItem: {
        backgroundColor: "#1e2525",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8.85,
    },
    routeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    routeIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: "#1a2b2b",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    routeIdContainer: {
        flex: 1,
    },
    routeId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#f5f2e5",
    },
    routeDate: {
        fontSize: 12,
        color: "#f5f2e5",
        opacity: 0.7,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: "#f5f2e5",
        fontSize: 12,
        fontWeight: "bold",
    },
    routeDetails: {
        marginLeft: 8,
    },
    routePoint: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    routeText: {
        color: "#f5f2e5",
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    routeConnector: {
        marginLeft: 10,
        height: 20,
        justifyContent: "center",
    },
    connectorLine: {
        width: 2,
        height: "100%",
        backgroundColor: "#a51912",
        marginLeft: 8,
    },
    bottomNav: {
        flexDirection: "row",
        backgroundColor: "#1e2525",
        paddingVertical: 12,
        paddingHorizontal: 30,
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "rgba(165, 25, 18, 0.3)",
    },
    bottomNavItem: {
        alignItems: "center",
        flex: 1,
    },
    bottomNavText: {
        color: "#f5f2e5",
        fontSize: 12,
        marginTop: 4,
    },
    bottomNavTextActive: {
        color: "#a51912",
        fontWeight: "bold",
    },
    bottomNavItemActive: {
        borderBottomWidth: 0.225,
        borderColor: "#a51912",
    },
    routeInfo: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(245, 242, 229, 0.1)",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    infoText: {
        color: "#f5f2e5",
        fontSize: 12,
        marginLeft: 8,
        opacity: 0.9,
    },
    errorMessage: {
        color: "#5d0000",
        textAlign: "center",
        marginVertical: 10,
    },

    topBar: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#1e2525",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profilePhotoContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: "#182727",
    },
    profilePhoto: {
        width: "100%",
        height: "100%",
    },
    profilePhotoPlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#182727",
    },
    navButton: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    navIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#182727",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
        borderWidth: 1,
        borderColor: "rgba(165, 25, 18, 0.3)",
    },
    navText: {
        color: "#f5f2e5",
        fontSize: 12,
        marginTop: 4,
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1a2b2b",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
      },
      modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
      },
      modalMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
      },
      modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      },
      modalButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      },
      cancelButton: {
        backgroundColor: "#ccc",
      },
      logoutButton: {
        backgroundColor: "#a51912",
      },
      buttonText: {
        color: "white",
        fontSize: 16,
      },
      footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#1e2525",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
      },
      logoutText: {
        marginLeft: 10,
        color: "#fff",
        fontSize: 16,
      },
});