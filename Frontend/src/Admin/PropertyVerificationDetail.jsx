// PropertyVerificationDetail.jsx
import React, { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Image as ImageIcon,
  Home,
  Sofa,
  Grid3x3,
  Camera
} from 'lucide-react';

const PropertyVerificationDetail = ({ property, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState('verification');

  if (!property) return null;

  const { verification = {}, amenities = [], description = '' } = property;

  const verificationDocs = [
    { id: 'aadhar', label: 'Aadhar Card' },
    { id: 'pan', label: 'PAN Card' },
    { id: 'propertyTax', label: 'Property Tax Receipt' },
    { id: 'ownershipDeed', label: 'Ownership Deed' },
    { id: 'utilityBill', label: 'Utility Bill' }
  ];

  const renderImageGallery = (images, title) => {
    if (!images || images.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>No {title} images uploaded</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.slice(0, 6).map((img, index) => (
          <div key={index} className="relative group">
            <img 
              src={img} 
              alt={`${title} ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length > 6 && (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-500">+{images.length - 6} more</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`rounded-xl p-4 ${
        property.status === 'Verified' ? 'bg-green-50 border border-green-200' :
        property.status === 'Rejected' ? 'bg-red-50 border border-red-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          {property.status === 'Verified' && <CheckCircle className="w-6 h-6 text-green-600" />}
          {property.status === 'Rejected' && <XCircle className="w-6 h-6 text-red-600" />}
          {property.status === 'Pending' && <Clock className="w-6 h-6 text-yellow-600" />}
          <div>
            <h3 className="font-semibold text-gray-800">
              Status: {property.status}
              {property.status === 'Verified' && ' ✅'}
              {property.status === 'Rejected' && ' ❌'}
              {property.status === 'Pending' && ' ⏳'}
            </h3>
            {verification.reviewedAt && (
              <p className="text-xs text-gray-500">
                Reviewed on: {new Date(verification.reviewedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'verification'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Verification Details
          </div>
        </button>
        <button
          onClick={() => setActiveTab('property')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'property'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Property Details
          </div>
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'images'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Images
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {/* Owner Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Owner Name</span>
                </div>
                <p className="text-gray-800">{verification.ownerName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Owner Email</span>
                </div>
                <p className="text-gray-800">{verification.ownerEmail || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">Owner Phone</span>
                </div>
                <p className="text-gray-800">{verification.ownerPhone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">Property Address</span>
                </div>
                <p className="text-gray-800">{verification.propertyAddress || 'N/A'}</p>
              </div>
            </div>

            {/* Verification Documents */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Verification Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verificationDocs.map((doc) => {
                  const docImage = verification.documents?.[doc.id];
                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                        </div>
                        {docImage ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {docImage ? (
                        <div className="relative">
                          <img 
                            src={docImage} 
                            alt={doc.label}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-md hover:bg-black/90 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-400">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                          Document not uploaded
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes */}
            {verification.additionalNotes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
                <p className="text-gray-600">{verification.additionalNotes}</p>
              </div>
            )}

            {/* Submission Info */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted for verification on: {new Date(verification.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'property' && (
          <div className="space-y-6">
            {/* Property Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Type</span>
                </div>
                <p className="text-gray-800">{property.type}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Bed className="w-4 h-4" />
                  <span className="font-medium">BHK</span>
                </div>
                <p className="text-gray-800">{property.bedrooms} BHK</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Bath className="w-4 h-4" />
                  <span className="font-medium">Bathrooms</span>
                </div>
                <p className="text-gray-800">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Square className="w-4 h-4" />
                  <span className="font-medium">Area</span>
                </div>
                <p className="text-gray-800">{property.area} sq.ft</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-medium">Price</span>
                </div>
                <p className="text-gray-800">₹{property.price.toLocaleString()}/month</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-gray-800 truncate">{property.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-600">{description || 'No description provided'}</p>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {amenities && amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No amenities listed</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* We'll use the images from the property */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Property Images</h4>
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {property.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Property ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <button className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-3" />
                  <p>No images uploaded</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {property.status === 'Pending' && (
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onApprove}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve Property
          </button>
          <button
            onClick={onReject}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject Property
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            Request More Info
          </button>
        </div>
      )}

      {property.status !== 'Pending' && (
        <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
            property.status === 'Verified' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {property.status === 'Verified' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                This property has been verified and approved
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                This property has been rejected
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyVerificationDetail;