
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  property_type: string;
  status: string;
  images: string;
}

interface PropertyFormFieldsProps {
  formData: PropertyFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const PropertyFormFields = ({ formData, onInputChange }: PropertyFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g. Modern 2BR Apartment"
            required
          />
        </div>
        <div>
          <Label htmlFor="property_type">Property Type</Label>
          <Select 
            value={formData.property_type} 
            onValueChange={(value) => onInputChange('property_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder="e.g. Westlands, Nairobi"
          required
        />
      </div>

      {/* Bedrooms, Bathrooms & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select 
            value={formData.bedrooms.toString()} 
            onValueChange={(value) => onInputChange('bedrooms', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4 Bedrooms</SelectItem>
              <SelectItem value="5">5+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Select 
            value={formData.bathrooms.toString()} 
            onValueChange={(value) => onInputChange('bathrooms', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bathroom</SelectItem>
              <SelectItem value="2">2 Bathrooms</SelectItem>
              <SelectItem value="3">3 Bathrooms</SelectItem>
              <SelectItem value="4">4+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onInputChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacant">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Monthly Rent (KSH) *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="1000"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="25000"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe the property features, amenities, etc."
          rows={3}
        />
      </div>

      {/* Image URL */}
      <div>
        <Label htmlFor="images">Image URL (Optional)</Label>
        <Input
          id="images"
          type="url"
          value={formData.images}
          onChange={(e) => onInputChange('images', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
};

export default PropertyFormFields;
