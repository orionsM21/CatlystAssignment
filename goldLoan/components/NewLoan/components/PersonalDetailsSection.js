import React from 'react';
import { View } from 'react-native';
import { DatePickerInput, renderDropdown, renderInput } from './FormFields';
// import { renderInput, renderDropdown, DatePickerInput } from '../common/FormFields';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' },
];

export const PersonalDetailsSection = React.memo(
  ({ values = {}, onChange }) => {
    return (
      <View>
        {renderInput('First Name', values.firstName, v => onChange('FirstName', v))}
        {renderInput('Middle Name', values.middleName, v => onChange('MiddleName', v))}
        {renderInput('Last Name', values.lastName, v => onChange('LastName', v))}
        {renderInput('Mobile Number', values.mobile, v => onChange('Mobile', v), {
          isMobile: true,
        })}
        {renderInput('Email', values.email, v => onChange('Email', v))}

        {renderDropdown(
          'Gender',
          GENDER_OPTIONS,
          values.gender,
          item => onChange('Gender', item.value),
          'Select Gender'
        )}

        <DatePickerInput
          label="Date of Birth"
          value={values.dob}
          onChange={v => onChange('Dob', v)}
        />

        {renderInput('PAN Number', values.pan, v => onChange('Pan', v), {
          isPan: true,
        })}

        {renderInput('Aadhaar Number', values.aadhaar, v => onChange('Aadhaar', v), {
          isAadhaar: true,
        })}
      </View>
    );
  }
);
