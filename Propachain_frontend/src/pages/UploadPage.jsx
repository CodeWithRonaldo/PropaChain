import { useState } from "react";
import { Upload, Home, FileText, Video, Image as ImageIcon, DollarSign, MapPin, Building2, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadImageVideoFile } from "../utils/helper";
import { usePropertyUpload } from "../hooks/usePropertyUpload";
import { Button } from "../components/common/Button";
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const UploadPage = () => {
  const { uploadProperty } = usePropertyUpload();
  const [loading, setLoading] = useState(false)
  const [listingType, setListingType] = useState("");
  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "",
    description: "",
    price: "",
    monthlyRent: "",
    rentalPeriod: "",
    depositRequired: "",
    document: null,
    images: [],
    video: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    if (!e.target.files) return;
    const files = field === "images" ? Array.from(e.target.files) : e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: files }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!listingType) {
      toast.error("Please select a listing type");
      return;
    }
    
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const toastId = toast.loading("Processing upload...");
    setLoading(true);

    try {
      const cids = await uploadImageVideoFile(
        e,
        formData.images[0],
        formData.video,
        formData.document,
        toastId
      );

      if (cids) {
        await uploadProperty(listingType, formData, cids, toastId);
        toast.success("Property uploaded successfully!", { id: toastId });
        
        // Reset form
        handleReset();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during upload", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      propertyAddress: "",
      propertyType: "",
      description: "",
      price: "",
      monthlyRent: "",
      rentalPeriod: "",
      depositRequired: "",
      document: null,
      images: [],
      video: null,
    });
    setListingType("");
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-4">
          <Upload size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          List Your Property
        </h1>
        <p className="text-slate-500 text-lg">
          Upload your property details to the Movement blockchain marketplace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Listing Type Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <label className="block font-bold text-slate-900 text-lg mb-6">Listing Type <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setListingType("sale")}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-300 relative group",
                listingType === "sale"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-200 hover:border-primary/50 bg-white"
              )}
            >
              <div className="flex flex-col items-center gap-3">
                <Home size={32} className={cn(listingType === "sale" ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                <span className={cn("font-semibold text-lg", listingType === "sale" ? "text-primary" : "text-slate-600")}>For Sale</span>
                {listingType === "sale" && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setListingType("rent")}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-300 relative group",
                listingType === "rent"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-200 hover:border-primary/50 bg-white"
              )}
            >
              <div className="flex flex-col items-center gap-3">
                <Building2 size={32} className={cn(listingType === "rent" ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                <span className={cn("font-semibold text-lg", listingType === "rent" ? "text-primary" : "text-slate-600")}>For Rent</span>
                {listingType === "rent" && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                     <Check size={14} />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Basic Information</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Property Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyAddress"
                placeholder="e.g. 123 Main Street, New York"
                value={formData.propertyAddress}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Condo">Condo</option>
                <option value="Studio">Studio</option>
                <option value="Land">Land</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              placeholder="Describe your property in detail (location, amenities, features, etc.)"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Pricing</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <DollarSign size={16} className="text-primary" />
              {listingType === "rent" ? "Purchase Price (Optional)" : "Property Price"} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                placeholder="Enter amount"
                value={formData.price}
                onChange={handleChange}
                required={listingType !== "rent"}
                className="w-full border border-slate-200 rounded-xl p-3 pr-20 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs">MOVE</span>
            </div>
          </div>

          {/* Rental-specific fields */}
          {listingType === "rent" && (
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Monthly Rent <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    name="monthlyRent"
                    placeholder="500"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    required={listingType === "rent"}
                    className="w-full border border-slate-200 rounded-xl p-3 pr-20 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs">MOVE</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Rental Period <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    name="rentalPeriod"
                    placeholder="12"
                    value={formData.rentalPeriod}
                    onChange={handleChange}
                    required={listingType === "rent"}
                    className="w-full border border-slate-200 rounded-xl p-3 pr-20 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">months</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Deposit <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    name="depositRequired"
                    placeholder="1000"
                    value={formData.depositRequired}
                    onChange={handleChange}
                    required={listingType === "rent"}
                    className="w-full border border-slate-200 rounded-xl p-3 pr-20 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs">MOVE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Media Uploads */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Media & Documents</h3>
          
          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              Property Images <span className="text-red-500">*</span> <span className="text-xs text-slate-400 font-normal">(Max 10 images)</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "images")}
                className="hidden"
                id="images-upload"
              />
              <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-slate-700">Click to upload images</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {/* Video */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Video size={16} className="text-primary" />
                Property Video (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                   <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                     <Video size={20} />
                   </div>
                  <p className="text-sm font-medium text-slate-700">Upload video</p>
                  <p className="text-xs text-slate-400 mt-1">MP4, MOV up to 100MB</p>
                </label>
              </div>
              {formData.video && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  <Check size={14} /> {formData.video.name}
                </div>
              )}
            </div>

            {/* Documents */}
            {listingType === "sale" && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => handleFileChange(e, "document")}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center">
                     <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <FileText size={20} />
                     </div>
                    <p className="text-sm font-medium text-slate-700">Upload PDF</p>
                    <p className="text-xs text-slate-400 mt-1">Deeds, Reports, etc.</p>
                  </label>
                </div>
                {formData.document && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <Check size={14} /> {formData.document.name}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={loading}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="px-8 shadow-xl shadow-primary/20"
          >
            Submit Property
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
