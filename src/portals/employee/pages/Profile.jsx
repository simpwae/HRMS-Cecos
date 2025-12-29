import { useState, useMemo } from 'react';
import { useAuthStore } from '../../../state/auth';
import { useDataStore } from '../../../state/data';
import Card from '../../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import Avatar from '../../../components/Avatar';
import FileUpload from '../../../components/FileUpload';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import EmployeeRequestForm from './EmployeeRequestForm';

export default function Profile() {
  // Get real user and employee data from stores
  const user = useAuthStore((s) => s.user);
  const { employees, submitProfileUpdateRequest } = useDataStore();
  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id || e.email === user?.email),
    [employees, user],
  );
  // Publications state (with dummy data if empty)
  // Dependents state (with dummy data if empty)
  const [dependents, setDependents] = useState(
    employee?.dependents && employee.dependents.length > 0
      ? employee.dependents
      : [
          {
            name: 'Ayesha Khan',
            relationship: 'Daughter',
            dob: '2015-06-12',
            cnic: '17301-9876543-2',
            document: '',
          },
          {
            name: 'Ali Khan',
            relationship: 'Son',
            dob: '2018-09-25',
            cnic: '17301-8765432-1',
            document: '',
          },
        ],
  );
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [dependentEditIndex, setDependentEditIndex] = useState(null);
  const [dependentForm, setDependentForm] = useState({
    name: '',
    relationship: '',
    dob: '',
    cnic: '',
    document: '',
  });

  function handleDependentFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setDependentForm((f) => ({ ...f, document: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDependentSubmit(e) {
    e.preventDefault();
    if (!employee?.id) return;
    let newDependents = [...dependents];
    if (dependentEditIndex !== null) {
      newDependents[dependentEditIndex] = { ...dependentForm };
    } else {
      newDependents.push({ ...dependentForm });
    }
    setDependents(newDependents);
    submitProfileUpdateRequest(
      employee.id,
      { dependents: newDependents },
      {
        requestedBy: employee?.name || user?.name,
        notes: 'Dependent update',
      },
    );
    setShowDependentModal(false);
    setDependentEditIndex(null);
    setDependentForm({ name: '', relationship: '', dob: '', cnic: '', document: '' });
  }

  function handleRemoveDependent(idx) {
    if (!employee?.id) return;
    const newDependents = dependents.filter((_, i) => i !== idx);
    setDependents(newDependents);
    submitProfileUpdateRequest(
      employee.id,
      { dependents: newDependents },
      {
        requestedBy: employee?.name || user?.name,
        notes: 'Dependent removal',
      },
    );
  }
  const [publications, setPublications] = useState(
    employee?.publications && employee.publications.length > 0
      ? employee.publications
      : [
          {
            title: 'A Study on React Performance',
            journal: 'International Journal of Web Dev',
            year: '2024',
            link: 'https://example.com/react-performance',
            document: '',
          },
          {
            title: 'Modern HRMS Systems',
            journal: 'HR Tech Review',
            year: '2023',
            link: '',
            document: '',
          },
        ],
  );
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  // Qualifications state (with dummy data if empty)
  const [qualifications, setQualifications] = useState(
    employee?.qualifications && employee.qualifications.length > 0
      ? employee.qualifications
      : [
          {
            degree: 'PhD Computer Science',
            institution: 'CECOS University',
            field: 'Software Engineering',
            year: '2022',
            document: '',
          },
          {
            degree: 'MS Information Technology',
            institution: 'FAST NUCES',
            field: 'IT',
            year: '2019',
            document: '',
          },
        ],
  );
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  // Edit Profile modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: employee?.name || '',
    designation: employee?.designation || '',
    department: employee?.department || '',
    faculty: employee?.faculty || '',
    status: employee?.status || 'Active',
  });
  // Publications logic
  const [publicationEditIndex, setPublicationEditIndex] = useState(null);
  const [publicationForm, setPublicationForm] = useState({
    title: '',
    journal: '',
    year: '',
    link: '',
    document: '',
  });

  function handlePublicationFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPublicationForm((f) => ({ ...f, document: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePublicationSubmit(e) {
    e.preventDefault();
    if (!employee?.id) return;
    let newPublications = [...publications];
    if (publicationEditIndex !== null) {
      newPublications[publicationEditIndex] = { ...publicationForm };
    } else {
      newPublications.push({ ...publicationForm });
    }
    setPublications(newPublications);
    submitProfileUpdateRequest(
      employee.id,
      { publications: newPublications },
      {
        requestedBy: employee?.name || user?.name,
        notes: 'Publication update',
      },
    );
    setShowPublicationModal(false);
    setPublicationEditIndex(null);
    setPublicationForm({ title: '', journal: '', year: '', link: '', document: '' });
  }

  function handleRemovePublication(idx) {
    if (!employee?.id) return;
    const newPublications = publications.filter((_, i) => i !== idx);
    setPublications(newPublications);
    submitProfileUpdateRequest(
      employee.id,
      { publications: newPublications },
      {
        requestedBy: employee?.name || user?.name,
        notes: 'Publication removal',
      },
    );
  }
  // Qualifications logic
  const [qualificationEditIndex, setQualificationEditIndex] = useState(null);
  const [qualificationForm, setQualificationForm] = useState({
    degree: '',
    institution: '',
    field: '',
    year: '',
    document: '',
  });

  function handleQualificationFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setQualificationForm((f) => ({ ...f, document: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleQualificationSubmit(e) {
    e.preventDefault();
    if (!employee?.id) return;
    let newQualifications = [...qualifications];
    if (qualificationEditIndex !== null) {
      newQualifications[qualificationEditIndex] = { ...qualificationForm };
    } else {
      newQualifications.push({ ...qualificationForm });
    }
    setQualifications(newQualifications);
    submitProfileUpdateRequest(
      employee.id,
      { qualifications: newQualifications },
      {
        requestedBy: employee?.name || user?.name,
        notes: 'Qualification update',
      },
    );
    setShowQualificationModal(false);
    setQualificationEditIndex(null);
    setQualificationForm({ degree: '', institution: '', field: '', year: '', document: '' });
  }

  const onSubmit = (data) => {
    if (employee) {
      submitProfileUpdateRequest(employee.id, data, {
        requestedBy: employee?.name || user?.name,
        notes: 'Profile update',
      });
    }
    setShowEditModal(false);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="dependents">Dependents</TabsTrigger>
        <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
        <TabsTrigger value="publications">Publications</TabsTrigger>
        <TabsTrigger value="cecpf">CECPF Provident Fund</TabsTrigger>
      </TabsList>
      <TabsContent value="dependents">
        <Card title="Dependents">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => {
                setDependentForm({ name: '', relationship: '', dob: '', cnic: '', document: '' });
                setDependentEditIndex(null);
                setShowDependentModal(true);
              }}
            >
              Add Dependent
            </Button>
          </div>
          {dependents.length === 0 ? (
            <div className="text-gray-500">No dependents added yet.</div>
          ) : (
            <ul className="divide-y">
              {dependents.map((d, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-600">{d.relationship}</div>
                    <div className="text-xs text-gray-500">DOB: {d.dob}</div>
                    <div className="text-xs text-gray-500">CNIC: {d.cnic}</div>
                    {d.document && (
                      <a
                        href={d.document}
                        className="text-blue-600 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDependentForm(d);
                        setDependentEditIndex(idx);
                        setShowDependentModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleRemoveDependent(idx)}>
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </TabsContent>
      {/* Dependent Modal */}
      <Modal
        open={showDependentModal}
        onClose={() => setShowDependentModal(false)}
        title={dependentEditIndex !== null ? 'Edit Dependent' : 'Add Dependent'}
      >
        <form onSubmit={handleDependentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border rounded p-2"
              value={dependentForm.name}
              onChange={(e) => setDependentForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Relationship</label>
            <input
              className="w-full border rounded p-2"
              value={dependentForm.relationship}
              onChange={(e) => setDependentForm((f) => ({ ...f, relationship: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={dependentForm.dob}
              onChange={(e) => setDependentForm((f) => ({ ...f, dob: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">CNIC</label>
            <input
              className="w-full border rounded p-2"
              value={dependentForm.cnic}
              onChange={(e) => setDependentForm((f) => ({ ...f, cnic: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Document</label>
            <FileUpload onChange={handleDependentFileChange} />
            {dependentForm.document && (
              <div className="mt-2">
                <a
                  href={dependentForm.document}
                  className="text-blue-600 text-xs underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Document
                </a>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowDependentModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <TabsContent value="profile">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-blue-600 to-blue-800" />
          <div className="relative pt-16 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  name={employee?.name || user?.name}
                  size="2xl"
                  className="ring-4 ring-white"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{employee?.name || user?.name}</h2>
                <p className="text-gray-600">{employee?.designation || 'Employee'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="primary">{employee?.department || user?.department}</Badge>
                  <Badge variant="outline">{employee?.faculty || user?.faculty}</Badge>
                  <Badge variant={employee?.status === 'Active' ? 'success' : 'warning'}>
                    {employee?.status || 'Active'}
                  </Badge>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditForm({
                      name: employee?.name || '',
                      designation: employee?.designation || '',
                      department: employee?.department || '',
                      faculty: employee?.faculty || '',
                      status: employee?.status || 'Active',
                    });
                    setShowEditModal(true);
                  }}
                  className="gap-2"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {/* Dummy Info Card */}
        <Card className="mt-4" title="Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-xs">Email</div>
              <div className="font-medium">john.doe@cecos.edu.pk</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Phone</div>
              <div className="font-medium">+92 300 1234567</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">CNIC</div>
              <div className="font-medium">12345-6789012-3</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Joining Date</div>
              <div className="font-medium">2022-08-15</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Address</div>
              <div className="font-medium">123 Main Street, Peshawar</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Supervisor</div>
              <div className="font-medium">Dr. Ahmad Khan</div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="publications">
        <Card title="Publications">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => {
                setPublicationForm({ title: '', journal: '', year: '', link: '', document: '' });
                setPublicationEditIndex(null);
                setShowPublicationModal(true);
              }}
            >
              Add Publication
            </Button>
          </div>
          {publications.length === 0 ? (
            <div className="text-gray-500">No publications added yet.</div>
          ) : (
            <ul className="divide-y">
              {publications.map((pub, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{pub.title}</div>
                    <div className="text-sm text-gray-600">
                      {pub.journal} ({pub.year})
                    </div>
                    {pub.link && (
                      <a
                        href={pub.link}
                        className="text-blue-600 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.link}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPublicationForm(pub);
                        setPublicationEditIndex(idx);
                        setShowPublicationModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleRemovePublication(idx)}>
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="cecpf">
        <Card title="CECPF Provident Fund">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Apply for CECPF Provident Fund</h2>
            <p className="text-gray-600 mb-4">
              Submit your application for the CECOS Employees Contributory Provident Fund. Your
              request will be reviewed by the Finance department.
            </p>
            <div className="max-w-xl">
              <EmployeeRequestForm />
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="qualifications">
        <Card title="Qualifications">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => {
                setQualificationForm({
                  degree: '',
                  institution: '',
                  field: '',
                  year: '',
                  document: '',
                });
                setQualificationEditIndex(null);
                setShowQualificationModal(true);
              }}
            >
              Add Qualification
            </Button>
          </div>
          {qualifications.length === 0 ? (
            <div className="text-gray-500">No qualifications added yet.</div>
          ) : (
            <ul className="divide-y">
              {qualifications.map((q, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{q.degree}</div>
                    <div className="text-sm text-gray-600">
                      {q.institution} ({q.year})
                    </div>
                    <div className="text-xs text-gray-500">{q.field}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setQualificationForm(q);
                        setQualificationEditIndex(idx);
                        setShowQualificationModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveQualification(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </TabsContent>

      {/* Edit Profile Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!employee?.id) return;
            submitProfileUpdateRequest(employee.id, editForm, {
              requestedBy: employee?.name || user?.name,
              notes: 'Profile update',
            });
            setShowEditModal(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border rounded p-2"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Designation</label>
            <input
              className="w-full border rounded p-2"
              value={editForm.designation}
              onChange={(e) => setEditForm((f) => ({ ...f, designation: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <input
              className="w-full border rounded p-2"
              value={editForm.department}
              onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Faculty</label>
            <input
              className="w-full border rounded p-2"
              value={editForm.faculty}
              onChange={(e) => setEditForm((f) => ({ ...f, faculty: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border rounded p-2"
              value={editForm.status}
              onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Publication Modal */}
      <Modal
        open={showPublicationModal}
        onClose={() => setShowPublicationModal(false)}
        title={publicationEditIndex !== null ? 'Edit Publication' : 'Add Publication'}
      >
        <form onSubmit={handlePublicationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="w-full border rounded p-2"
              value={publicationForm.title}
              onChange={(e) => setPublicationForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Journal</label>
            <input
              className="w-full border rounded p-2"
              value={publicationForm.journal}
              onChange={(e) => setPublicationForm((f) => ({ ...f, journal: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input
              className="w-full border rounded p-2"
              value={publicationForm.year}
              onChange={(e) => setPublicationForm((f) => ({ ...f, year: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Link</label>
            <input
              className="w-full border rounded p-2"
              value={publicationForm.link}
              onChange={(e) => setPublicationForm((f) => ({ ...f, link: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Document</label>
            <FileUpload onChange={handlePublicationFileChange} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPublicationModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Qualification Modal */}
      <Modal
        open={showQualificationModal}
        onClose={() => setShowQualificationModal(false)}
        title={qualificationEditIndex !== null ? 'Edit Qualification' : 'Add Qualification'}
      >
        <form onSubmit={handleQualificationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Degree</label>
            <input
              className="w-full border rounded p-2"
              value={qualificationForm.degree}
              onChange={(e) => setQualificationForm((f) => ({ ...f, degree: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Institution</label>
            <input
              className="w-full border rounded p-2"
              value={qualificationForm.institution}
              onChange={(e) => setQualificationForm((f) => ({ ...f, institution: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Field</label>
            <input
              className="w-full border rounded p-2"
              value={qualificationForm.field}
              onChange={(e) => setQualificationForm((f) => ({ ...f, field: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input
              className="w-full border rounded p-2"
              value={qualificationForm.year}
              onChange={(e) => setQualificationForm((f) => ({ ...f, year: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Document</label>
            <FileUpload onChange={handleQualificationFileChange} />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowQualificationModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </Tabs>
  );
}
