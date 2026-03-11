import React from 'react';
import { View } from 'react-native';
import { renderDropdown, renderInput } from './FormFields';
// import { renderInput, renderDropdown } from '../common/FormFields';

export const AddressSection = React.memo(
    ({
        values = {},
        pincodes = [],
        selectedPincode,
        onPincodeChange,
        onChange,
    }) => {
        return (
            <View>
                {renderInput(
                    'Address Line 1',
                    values.addressline1,
                    v => onChange('addressline1', v)
                )}

                {renderInput(
                    'Address Line 2',
                    values.addressline2,
                    v => onChange('addressline2', v)
                )}

                {renderInput(
                    'Address Line 3',
                    values.addressline3,
                    v => onChange('addressline3', v)
                )}

                {renderDropdown(
                    'Pincode',
                    pincodes,
                    selectedPincode,
                    onPincodeChange,
                    'Select Pincode'
                )}

                {renderInput('Country', values.Country, () => { }, { editable: false })}
                {renderInput('State', values.State, () => { }, { editable: false })}
                {renderInput('City', values.City, () => { }, { editable: false })}
                {renderInput('Area', values.Area, () => { }, { editable: false })}
            </View>
        );
    }
);
