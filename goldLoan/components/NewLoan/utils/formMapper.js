export const mapLeadToForm = (lead = {}) => {
  const applicant = lead?.applicant?.[0]?.consumptionApplicant || {};
  const address = lead?.applicant?.[0]?.address?.[0] || {};
  const pincode = applicant?.pincode || {};

  return {
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    mobile: applicant.mobileNo,
    email: applicant.email,
    pan: applicant.pan,
    aadhaar: applicant.aadhaar,

    addressline1: address.addressLine1,
    addressline2: address.addressLine2,
    addressline3: address.addressLine3,

    pincode: pincode.pincode,
    Country: pincode?.country?.countryName,
    State: pincode?.state?.stateName,
    City: pincode?.city?.cityName,
    Area: address.areaName,
  };
};
