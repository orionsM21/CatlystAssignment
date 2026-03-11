import { useState } from 'react';
import { Alert } from 'react-native';

export function useOtp(api) {
  const [otp, setOtp] = useState({
    applicant: ['', '', '', ''],
    coApplicant: ['', '', '', ''],
    guarantor: ['', '', '', ''],
  });

  const sendOtp = async (mobileNo) => {
    await api.post('/sendOtpToMobile', { mobileNo });
  };

  const verifyOtp = async ({ type, otpValue, userId }) => {
    const res = await api.post('/verifyOtpToMobile', {
      otp: otpValue.join(''),
      id: userId,
    });

    if (res.data.msgKey !== 'Success') {
      Alert.alert('Invalid OTP');
      return false;
    }
    return true;
  };

  return { otp, setOtp, sendOtp, verifyOtp };
}
