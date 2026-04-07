export default function LeadChecklist() {
  const installItems = [
    "Confirm booth location",
    "Review renderings and floor plan",
    "Check electrical / lighting requirements",
    "Install graphics and structural components",
    "Client walkthrough completed",
  ];

  const dismantleItems = [
    "Graphics removed",
    "Crates packed",
    "Carpet / flooring cleared",
    "Tool count complete",
    "Labor signed out",
  ];

  return (
    <div className="grid-2">
      <div className="card">
        <div className="section-title">Install Checklist</div>
        <div className="list">
          {installItems.map((item) => (
            <label key={item} className="list-item" style={{ display: "flex", gap: 10 }}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Dismantle Checklist</div>
        <div className="list">
          {dismantleItems.map((item) => (
            <label key={item} className="list-item" style={{ display: "flex", gap: 10 }}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
