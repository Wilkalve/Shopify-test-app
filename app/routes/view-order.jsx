import {
  Page,
  Layout,
  Card,
  DataTable,
  Text,
  Link,
  Badge,
  InlineStack,
} from "@shopify/polaris";

export default function ViewOrdersPage() {
  //Test sample data, actual API calls will be implemented later
  const orders = [
    {
      id: "ORD-001",
      customerName: "James Johnson",
      infill: "20%",
      wallThickness: "1.2mm",
      filamentType: "PLA",
      filamentColor: "Red",
      printTime: "2.5 hrs",
      totalPrice: "$45.50",
      status: "Pending",
      fileUrl: "https://storage.googleapis.com/your-bucket/files/order-001-model.stl",
      orderDate: "2025-01-15"
    },
    {
      id: "ORD-002",
      customerName: "Wade Wilson",
      infill: "15%",
      wallThickness: "0.8mm",
      filamentType: "PETG",
      filamentColor: "Blue",
      printTime: "1.8 hrs",
      totalPrice: "$32.75",
      status: "In Progress",
      fileUrl: "https://storage.googleapis.com/your-bucket/files/order-002-model.stl",
      orderDate: "2025-01-14"
    },
    {
      id: "ORD-003",
      customerName: "Barry Allen",
      infill: "30%",
      wallThickness: "2.0mm",
      filamentType: "ABS",
      filamentColor: "Black",
      printTime: "4.2 hrs",
      totalPrice: "$78.25",
      status: "Completed",
      fileUrl: "https://storage.googleapis.com/your-bucket/files/order-003-model.stl",
      orderDate: "2025-01-13"
    },
    {
      id: "ORD-004",
      customerName: "Helena Wayne",
      infill: "25%",
      wallThickness: "1.5mm",
      filamentType: "PLA",
      filamentColor: "White",
      printTime: "3.1 hrs",
      totalPrice: "$56.40",
      status: "Pending",
      fileUrl: "https://storage.googleapis.com/your-bucket/files/order-004-model.stl",
      orderDate: "2025-01-12"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Pending": { status: "attention" },
      "In Progress": { status: "info" },
      "Completed": { status: "success" }
    };
    
    return (
      <Badge status={statusConfig[status]?.status || "default"}>
        {status}
      </Badge>
    );
  };

  const rows = orders.map((order) => [
    order.id,
    order.customerName,
    order.orderDate,
    <InlineStack gap="2" wrap={false}>
      <Text variant="bodyMd">Infill: {order.infill}</Text>
      <Text variant="bodyMd">Wall: {order.wallThickness}</Text>
    </InlineStack>,
    <InlineStack gap="2" wrap={false}>
      <Text variant="bodyMd">{order.filamentType}</Text>
      <Text variant="bodyMd">({order.filamentColor})</Text>
    </InlineStack>,
    order.printTime,
    order.totalPrice,
    getStatusBadge(order.status),
    <Link url={order.fileUrl} external>
      Download 3D File
    </Link>
  ]);

  const headings = [
    "Order ID",
    "Customer",
    "Order Date",
    "Print Settings",
    "Filament",
    "Print Time",
    "Total Price",
    "Status",
    "3D File"
  ];

  return (
    <Page title="View Orders">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "1rem" }}>
              <Text variant="headingMd" as="h2">
                3D Printing Orders
              </Text>
              <Text variant="bodyMd" color="subdued">
                Manage and track your 3D printing orders. Download customer files and update order status.
              </Text>
            </div>
            
            <DataTable
              columnContentTypes={[
                "text", // Order ID
                "text", // Customer
                "text", // Order Date
                "text", // Print Settings
                "text", // Filament
                "text", // Print Time
                "text", // Total Price
                "text", // Status
                "text"  // 3D File
              ]}
              headings={headings}
              rows={rows}
              pagination={{
                hasNext: false,
                hasPrevious: false,
              }}
            />
            
            <div style={{ padding: "1rem", borderTop: "1px solid #e1e3e5" }}>
              <InlineStack gap="4">
                <Text variant="bodyMd" color="subdued">
                  Total Orders: {orders.length}
                </Text>
                <Text variant="bodyMd" color="subdued">
                  Pending: {orders.filter(o => o.status === "Pending").length}
                </Text>
                <Text variant="bodyMd" color="subdued">
                  In Progress: {orders.filter(o => o.status === "In Progress").length}
                </Text>
                <Text variant="bodyMd" color="subdued">
                  Completed: {orders.filter(o => o.status === "Completed").length}
                </Text>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}