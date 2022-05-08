# AuthNavigator

```mermaid
graph TD
    AuthNavigator --> StartScreen
    StartScreen --> LoginScreen
    LoginScreen --> ForgetPasswordScreen
    LoginScreen --> MainTabNavigator
    StartScreen --> RegStepOneRegistrantDetails
    RegStepOneRegistrantDetails --> RegStepTwoClinicDetails
    RegStepTwoClinicDetails --> RegStepThreeDoctorDetails
    RegStepThreeDoctorDetails --> RegStepFourConfirmDetails
    RegStepFourConfirmDetails --> StartScreen
```
