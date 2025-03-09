import { IRole } from '@/app/(MemberManagement)/specialization/list/SpecializationList'
import { IMember } from '@/app/(MemberShipType)/membership/list/MemberShipList'
import { Document, Page, View, Text, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        textDecoration: 'underline',
    },
    table: {
        display: 'table' as any,
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
    },
    tableCell: {
        padding: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        width: '20%',
    },
})

export const MembersPDFDocument = ({ data }: { data: IMember[] | undefined }) => (
    <Document>
        {/* <Text style={styles.title}>Membership List Report</Text> */}
        <Page size="A4" style={styles.page}>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>S.No</Text>
                    <Text style={styles.tableCell}>Name</Text>
                    <Text style={styles.tableCell}>Period</Text>
                    <Text style={styles.tableCell}>Category</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                </View>
                {/* Table Rows */}
                {data?.map((member, index) => (
                    <View key={member._id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{member.name}</Text>
                        <Text style={styles.tableCell}>{member.period}</Text>
                        <Text style={styles.tableCell}>{member.category.name}</Text>
                        <Text style={styles.tableCell}>${member.amount}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
)

export const SpecializationPDFDocument = ({ data }: { data: IRole[] | undefined }) => (
    <Document>
        {/* <Text style={styles.title}>Membership List Report</Text> */}
        <Page size="A4" style={styles.page}>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>S.No</Text>
                    <Text style={styles.tableCell}>Name</Text>
                </View>
                {/* Table Rows */}
                {data?.map((member, index) => (
                    <View key={member._id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{member.name}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
)
export const RolePDFDocument = ({ data }: { data: IRole[] | undefined }) => (
    <Document>
        {/* <Text style={styles.title}>Membership List Report</Text> */}
        <Page size="A4" style={styles.page}>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>S.No</Text>
                    <Text style={styles.tableCell}>Role Name</Text>
                </View>
                {/* Table Rows */}
                {data?.map((member, index) => (
                    <View key={member._id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{member.name}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
)