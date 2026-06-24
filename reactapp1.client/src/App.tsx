import React from 'react';
import './App.css';
import AuditForm from './components/Audit';
import AuditTable from './components/AuditTable';
import Login from './components/Login';
import AddQuestion from './components/Add-question';
import AddQuestionForSpace from './components/AddQuestionForSpace';
import QuestionsTable from './components/Question-table';
import ConsultantMenuForm from './components/Consultant-menu';
import AuditEdit from './components/AuditEdit';
import QuestionsManagement from './components/QuestionsManagement';
import Reports from './components/Reports';
import AuditedByCounselorReport from './components/AuditedByCounselorReport';
import KindergartenReport from './components/KindergartenReport';
import AddressChangeReport from './components/AddressChangeReport';
import UserReports from './components/UserReports';
import AdminManagement from './components/AdminManagement';
import SecretaryManagement from './components/SecretaryManagement';
import AddOrganization from './components/AddOrganization';
import AddCounselor from './components/AddCounselor';
import AddSystemUser from './components/AddSystemUser';
import AddCity from './components/AddCity';
import CitiesTable from './components/CitiesTable';
import HubsTable from './components/HubsTable';
import Certificate from './components/Certificate';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/consultantMenuForm" element={<ConsultantMenuForm />} />
                <Route path="/auditForm" element={React.createElement(AuditForm as any, { organizationId: "111" })} />
                <Route path="/auditTable" element={React.createElement(AuditTable as any, { counselorId: "234464555" })} />
                <Route path="/questionsManagement" element={<QuestionsManagement />} />
                <Route path="/addQuestion" element={React.createElement(AddQuestion as any, { organizationId: "111" })} />
                <Route path="/addQuestionForSpace" element={React.createElement(AddQuestionForSpace as any, { organizationId: "111" })} />
                <Route path="/questionsTable" element={<QuestionsTable />} />
                <Route path="/audit-edit/:id" element={<AuditEdit />} />
                <Route path="/certificate/:auditId" element={<Certificate />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/audited-by-counselor" element={<AuditedByCounselorReport />} />
                <Route path="/reports/kindergartens" element={<KindergartenReport />} />
                <Route path="/reports/address-changed" element={<AddressChangeReport />} />
                <Route path="/user-reports" element={<UserReports />} />
                <Route path="/admin-management" element={<AdminManagement />} />
                <Route path="/secretary-management" element={<SecretaryManagement />} />
                <Route path="/add-organization" element={<AddOrganization />} />
                <Route path="/add-counselor" element={<AddCounselor />} />
                <Route path="/add-system-user" element={<AddSystemUser />} />
                <Route path="/add-city" element={<AddCity />} />
                <Route path="/cities-table" element={<CitiesTable />} />
                <Route path="/hubs-table" element={<HubsTable />} />
          </Routes>
        </Router>
    );
}

export default App;

