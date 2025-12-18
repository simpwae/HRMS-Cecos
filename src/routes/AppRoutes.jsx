// ...existing imports...
import MedicalLeaves from '../portals/vc/pages/MedicalLeaves';

// ...existing routes...
export default function AppRoutes() {
  return (
    // ...existing Router/Routes...
    <>
      {/* ...existing routes... */}
      <Route path="/vc">
        <Route index element={<MedicalLeaves />} />
        <Route path="medical-leaves" element={<MedicalLeaves />} />
      </Route>
      {/* 404 etc. */}
    </>
  );
}