import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Text,
  FormLayout,
} from "@shopify/polaris";

export default function SetupPage() {
  const [basePrice, setBasePrice] = useState("10");
  const [infillMultiplier, setInfillMultiplier] = useState("0.05");
  const [wallThicknessMultiplier, setWallThicknessMultiplier] = useState("2.50");
  const [timeRate, setTimeRate] = useState("5");
  const [filaments, setFilaments] = useState([]);
  const [newFilament, setNewFilament] = useState({
    name: "",
    type: "",
    color: "",
    rate: "",
  });

  const addFilament = () => {
    if (
      newFilament.name.trim() &&
      newFilament.type.trim() &&
      newFilament.color.trim() &&
      newFilament.rate.trim()
    ) {
      setFilaments([
        ...filaments,
        {
          name: newFilament.name.trim(),
          type: newFilament.type.trim(),
          color: newFilament.color.trim(),
          rate: parseFloat(newFilament.rate.trim()),
        },
      ]);
      setNewFilament({ name: "", type: "", color: "", rate: "" });
    } else {
      alert("Please fill in all fields before adding a filament.");
    }
  };

  return (
    <Page title="3D Printing Setup">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Pricing Parameters">
            <FormLayout>
              <TextField
                label="Base Price ($)"
                type="number"
                value={basePrice}
                onChange={(value) => setBasePrice(value)}
                helpText="Starting price for any 3D print job"
              />
              <TextField
                label="Infill Rate ($ per %)"
                type="number"
                value={infillMultiplier}
                onChange={(value) => setInfillMultiplier(value)}
                helpText="Additional cost per infill percentage"
              />
              <TextField
                label="Wall Thickness Rate ($ per mm)"
                type="number"
                value={wallThicknessMultiplier}
                onChange={(value) => setWallThicknessMultiplier(value)}
                helpText="Additional cost per mm of wall thickness"
              />
              <TextField
                label="Time Rate ($/hour)"
                type="number"
                value={timeRate}
                onChange={(value) => setTimeRate(value)}
                helpText="Hourly rate for printing time"
              />
            </FormLayout>

            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f6f6f7", borderRadius: "4px" }}>
              <Text variant="headingSm">Quote Formula Preview:</Text>
              <Text variant="bodyMd">
                Final Price = Base Price + (Infill % × Infill Rate) + (Wall Thickness × Wall Rate) + (Print Time × Time Rate) + Filament Cost
              </Text>
              <Text variant="bodyMd" color="subdued">
                Example: ${basePrice} + (20% × ${infillMultiplier}) + (1.2mm × ${wallThicknessMultiplier}) + (2hrs × ${timeRate}) + Filament
              </Text>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned title="Filament Types">
            <FormLayout>
              <TextField
                label="Filament Name"
                value={newFilament.name}
                onChange={(value) => setNewFilament({ ...newFilament, name: value })}
                placeholder="e.g., Premium PLA"
              />
              <TextField
                label="Type"
                value={newFilament.type}
                onChange={(value) => setNewFilament({ ...newFilament, type: value })}
                placeholder="e.g., PLA, ABS, PETG"
              />
              <TextField
                label="Color"
                value={newFilament.color}
                onChange={(value) => setNewFilament({ ...newFilament, color: value })}
                placeholder="e.g., Red, Blue, Transparent"
              />
              <TextField
                label="Rate ($/gram)"
                type="number"
                value={newFilament.rate}
                onChange={(value) => setNewFilament({ ...newFilament, rate: value })}
                placeholder="e.g., 0.03"
              />
              <Button onClick={addFilament} primary>Add Filament</Button>
            </FormLayout>

            <div style={{ marginTop: "1rem" }}>
              <Text variant="headingSm">Available Filaments:</Text>
              <div style={{ marginTop: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e1e3e5" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f6f6f7" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e1e3e5", fontWeight: "600" }}>ID</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e1e3e5", fontWeight: "600" }}>Filament Name</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e1e3e5", fontWeight: "600" }}>Type</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e1e3e5", fontWeight: "600" }}>Color</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e1e3e5", fontWeight: "600" }}>Rate ($/gram)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filaments.length > 0 ? (
                      filaments.map((filament, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #e1e3e5" }}>
                          <td style={{ padding: "0.75rem" }}>{index+1}</td>
                          <td style={{ padding: "0.75rem", fontWeight: "500" }}>{filament.name}</td>
                          <td style={{ padding: "0.75rem" }}>{filament.type}</td>
                          <td style={{ padding: "0.75rem" }}>{filament.color}</td>
                          <td style={{ padding: "0.75rem" }}>${filament.rate.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: "1rem", textAlign: "center", color: "#6d7175", fontStyle: "italic" }}>
                          No filaments added yet. Add your first filament above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
