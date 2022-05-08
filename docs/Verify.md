# Verify

```mermaid
graph TD
    VerifyStackNavigator --> SelectBenefitScreen
    SelectBenefitScreen -- benefitCode --> SelectDoctorScreen
    SelectDoctorScreen -- doctor --> VerifySelectionScreen
    VerifySelectionScreen -- method --> VerifyScanScreen
    VerifyScanScreen -- verifyCode --> api/verify.php
    api/verify.php -. response .-> VerifyScanScreen
    VerifyScanScreen -- success --> PatientInfoScreen --> SelectBenefitScreen
```
