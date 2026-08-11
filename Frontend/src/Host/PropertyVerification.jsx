import React, { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Phone,
  Building,
  Camera,
  CheckCircle,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';

// Verification document types
const verificationDocs = [
  { id: 'aadhar', label: 'Aadhar Card', icon: <User className="w-4 h-4" /> },
  { id: 'pan', label: 'PAN Card', icon: <FileText className="w-4 h-4" /> },
  { id: 'propertyTax', label: 'Property Tax Receipt', icon: <FileText className="w-4 h-4" /> },
  { id: 'ownershipDeed', label: 'Ownership Deed / Sale Agreement', icon: <FileText className="w-4 h-4" /> },
  { id: 'utilityBill', label: 'Utility Bill (Electricity/Water)', icon: <FileText className="w-4 h-4" /> },
];

const PropertyVerification = ({ formData, setFormData, onValidationChange }) => {
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle verification document upload
  const handleVerificationDocUpload = (e, docId) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        verificationDocs: {
          ...prev.verificationDocs,
          [docId]: imageUrl
        }
      }));
      
      // Clear error for this document
      if (errors[docId]) {
        setErrors(prev => ({ ...prev, [docId]: '' }));
      }
    }
  };
 
  const removeVerificationDoc = (docId) => {
    setFormData(prev => {
      const updatedDocs = { ...prev.verificationDocs };
      delete updatedDocs[docId];
      return { ...prev, verificationDocs: updatedDocs };
    });
  };

  // Validate verification section
  const validate = () => {
    const newErrors = {};
    
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail) newErrors.ownerEmail = 'Owner email is required';
    if (!formData.ownerPhone) newErrors.ownerPhone = 'Owner phone is required';
    if (!formData.propertyAddress) newErrors.propertyAddress = 'Property address is required';
    
    // Check required documents
    const requiredDocs = ['aadhar', 'pan', 'propertyTax', 'ownershipDeed'];
    requiredDocs.forEach(docId => {
      if (!formData.verificationDocs[docId]) {
        newErrors[docId] = `${verificationDocs.find(d => d.id === docId)?.label} is required`;
      }
    });

    setErrors(newErrors);
     
    const isValid = Object.keys(newErrors).length === 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
    return isValid;
  };

  // Expose validate function to parent
  React.useImperativeHandle(
    React.useRef(),
    () => ({
      validate
    }),
    [formData, errors]
  );

  return (
    <div className="border-t border-gray-100 pt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        Property Verification <span className="text-xs text-gray-500 font-normal">(Admin will verify these details)</span>
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Verification Required</p>
            <p className="text-xs text-blue-600">Please provide all the details below. Your property will be verified by our admin team before it goes live.</p>
          </div>
        </div>
      </div>

      {/* Owner Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Owner Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName || ''}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-2.5 border ${errors.ownerName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
              placeholder="e.g., John Doe"
            />
          </div>
          {errors.ownerName && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Owner Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail || ''}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-2.5 border ${errors.ownerEmail ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
              placeholder="e.g., john@example.com"
            />
          </div>
          {errors.ownerEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Owner Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone || ''}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-2.5 border ${errors.ownerPhone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
              placeholder="e.g., +91 9876543210"
            />
          </div>
          {errors.ownerPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Property Address (for verification) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress || ''}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-2.5 border ${errors.propertyAddress ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
              placeholder="e.g., 123, Main Street, Pune"
            />
          </div>
          {errors.propertyAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.propertyAddress}</p>
          )}
        </div>
      </div>

      {/* Verification Documents */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Verification Documents <span className="text-red-500">*</span>
          <span className="text-gray-400 text-xs ml-2">(Upload clear images)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationDocs.map((doc) => (
            <div 
              key={doc.id} 
              className={`border ${errors[doc.id] ? 'border-red-500' : 'border-gray-200'} rounded-xl p-4 hover:border-blue-400 transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {doc.icon}
                  <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                </div>
                {formData.verificationDocs && formData.verificationDocs[doc.id] && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              {formData.verificationDocs && formData.verificationDocs[doc.id] ? (
                <div className="relative">
                  <img 
                    src={formData.verificationDocs[doc.id]} 
                    alt={doc.label}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeVerificationDoc(doc.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed ${errors[doc.id] ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-lg p-3 text-center hover:border-blue-500 transition-colors cursor-pointer`}
                  onClick={() => document.getElementById(`doc-${doc.id}`).click()}
                >
                  <input
                    type="file"
                    id={`doc-${doc.id}`}
                    onChange={(e) => handleVerificationDocUpload(e, doc.id)}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Upload {doc.label}</span>
                  </div>
                  {errors[doc.id] && (
                    <p className="text-xs text-red-500 mt-1">{errors[doc.id]}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional Notes (Optional)
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes || ''}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
          placeholder="Any additional information for the admin verification team..."
        />
      </div>
    </div>
  );
};

export default PropertyVerification;