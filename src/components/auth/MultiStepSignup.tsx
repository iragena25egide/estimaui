import React, { useState,useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "../../context/AuthContext"





interface MultiStepSignupProps {
  switchToLogin: () => void
}



type Role = "ESTIMATOR" |  "VIEWER" | null
type Step = 1 | 2 | 3 | 4

interface FormData {
  firstName: string
  lastName: string
  email: string
  countryCode: string
  phone: string
  password: string
  confirmPassword: string
}

const COUNTRY_CODES = [
  { flag: "🇦🇫", code: "+93", country: "Afghanistan" },
  { flag: "🇦🇱", code: "+355", country: "Albania" },
  { flag: "🇩🇿", code: "+213", country: "Algeria" },
  { flag: "🇦🇸", code: "+1", country: "American Samoa" },
  { flag: "🇦🇩", code: "+376", country: "Andorra" },
  { flag: "🇦🇴", code: "+244", country: "Angola" },
  { flag: "🇦🇬", code: "+1", country: "Antigua and Barbuda" },
  { flag: "🇦🇷", code: "+54", country: "Argentina" },
  { flag: "🇦🇲", code: "+374", country: "Armenia" },
  { flag: "🇦🇺", code: "+61", country: "Australia" },
  { flag: "🇦🇹", code: "+43", country: "Austria" },
  { flag: "🇦🇿", code: "+994", country: "Azerbaijan" },
  { flag: "🇧🇸", code: "+1", country: "Bahamas" },
  { flag: "🇧🇭", code: "+973", country: "Bahrain" },
  { flag: "🇧🇩", code: "+880", country: "Bangladesh" },
  { flag: "🇧🇧", code: "+1", country: "Barbados" },
  { flag: "🇧🇾", code: "+375", country: "Belarus" },
  { flag: "🇧🇪", code: "+32", country: "Belgium" },
  { flag: "🇧🇿", code: "+501", country: "Belize" },
  { flag: "🇧🇯", code: "+229", country: "Benin" },
  { flag: "🇧🇲", code: "+1", country: "Bermuda" },
  { flag: "🇧🇹", code: "+975", country: "Bhutan" },
  { flag: "🇧🇴", code: "+591", country: "Bolivia" },
  { flag: "🇧🇦", code: "+387", country: "Bosnia and Herzegovina" },
  { flag: "🇧🇼", code: "+267", country: "Botswana" },
  { flag: "🇧🇷", code: "+55", country: "Brazil" },
  { flag: "🇧🇳", code: "+673", country: "Brunei" },
  { flag: "🇧🇬", code: "+359", country: "Bulgaria" },
  { flag: "🇧🇫", code: "+226", country: "Burkina Faso" },
  { flag: "🇧🇮", code: "+257", country: "Burundi" },
  { flag: "🇰🇭", code: "+855", country: "Cambodia" },
  { flag: "🇨🇲", code: "+237", country: "Cameroon" },
  { flag: "🇨🇦", code: "+1", country: "Canada" },
  { flag: "🇨🇻", code: "+238", country: "Cape Verde" },
  { flag: "🇨🇦", code: "+1", country: "Cayman Islands" },
  { flag: "🇨🇫", code: "+236", country: "Central African Republic" },
  { flag: "🇹🇩", code: "+235", country: "Chad" },
  { flag: "🇨🇱", code: "+56", country: "Chile" },
  { flag: "🇨🇳", code: "+86", country: "China" },
  { flag: "🇨🇴", code: "+57", country: "Colombia" },
  { flag: "🇰🇲", code: "+269", country: "Comoros" },
  { flag: "🇨🇬", code: "+242", country: "Congo" },
  { flag: "🇨🇷", code: "+506", country: "Costa Rica" },
  { flag: "🇭🇷", code: "+385", country: "Croatia" },
  { flag: "🇨🇺", code: "+53", country: "Cuba" },
  { flag: "🇨🇾", code: "+357", country: "Cyprus" },
  { flag: "🇨🇿", code: "+420", country: "Czech Republic" },
  { flag: "🇩🇰", code: "+45", country: "Denmark" },
  { flag: "🇩🇯", code: "+253", country: "Djibouti" },
  { flag: "🇩🇲", code: "+1", country: "Dominica" },
  { flag: "🇩🇴", code: "+1", country: "Dominican Republic" },
  { flag: "🇪🇨", code: "+593", country: "Ecuador" },
  { flag: "🇪🇬", code: "+20", country: "Egypt" },
  { flag: "🇸🇻", code: "+503", country: "El Salvador" },
  { flag: "🇬🇶", code: "+240", country: "Equatorial Guinea" },
  { flag: "🇪🇷", code: "+291", country: "Eritrea" },
  { flag: "🇪🇪", code: "+372", country: "Estonia" },
  { flag: "🇪🇹", code: "+251", country: "Ethiopia" },
  { flag: "🇫🇰", code: "+500", country: "Falkland Islands" },
  { flag: "🇫🇴", code: "+298", country: "Faroe Islands" },
  { flag: "🇫🇯", code: "+679", country: "Fiji" },
  { flag: "🇫🇮", code: "+358", country: "Finland" },
  { flag: "🇫🇷", code: "+33", country: "France" },
  { flag: "🇬🇫", code: "+594", country: "French Guiana" },
  { flag: "🇵🇫", code: "+689", country: "French Polynesia" },
  { flag: "🇬🇦", code: "+241", country: "Gabon" },
  { flag: "🇬🇲", code: "+220", country: "Gambia" },
  { flag: "🇬🇪", code: "+995", country: "Georgia" },
  { flag: "🇩🇪", code: "+49", country: "Germany" },
  { flag: "🇬🇭", code: "+233", country: "Ghana" },
  { flag: "🇬🇮", code: "+350", country: "Gibraltar" },
  { flag: "🇬🇷", code: "+30", country: "Greece" },
  { flag: "🇬🇱", code: "+299", country: "Greenland" },
  { flag: "🇬🇩", code: "+1", country: "Grenada" },
  { flag: "🇬🇵", code: "+590", country: "Guadeloupe" },
  { flag: "🇬🇺", code: "+1", country: "Guam" },
  { flag: "🇬🇹", code: "+502", country: "Guatemala" },
  { flag: "🇬🇬", code: "+44", country: "Guernsey" },
  { flag: "🇬🇳", code: "+224", country: "Guinea" },
  { flag: "🇬🇼", code: "+245", country: "Guinea-Bissau" },
  { flag: "🇬🇾", code: "+592", country: "Guyana" },
  { flag: "🇭🇹", code: "+509", country: "Haiti" },
  { flag: "🇭🇳", code: "+504", country: "Honduras" },
  { flag: "🇭🇰", code: "+852", country: "Hong Kong" },
  { flag: "🇭🇺", code: "+36", country: "Hungary" },
  { flag: "🇮🇸", code: "+354", country: "Iceland" },
  { flag: "🇮🇳", code: "+91", country: "India" },
  { flag: "🇮🇩", code: "+62", country: "Indonesia" },
  { flag: "🇮🇷", code: "+98", country: "Iran" },
  { flag: "🇮🇶", code: "+964", country: "Iraq" },
  { flag: "🇮🇪", code: "+353", country: "Ireland" },
  { flag: "🇮🇲", code: "+44", country: "Isle of Man" },
  { flag: "🇮🇱", code: "+972", country: "Israel" },
  { flag: "🇮🇹", code: "+39", country: "Italy" },
  { flag: "🇨🇮", code: "+225", country: "Ivory Coast" },
  { flag: "🇯🇲", code: "+1", country: "Jamaica" },
  { flag: "🇯🇵", code: "+81", country: "Japan" },
  { flag: "🇯🇪", code: "+44", country: "Jersey" },
  { flag: "🇯🇴", code: "+962", country: "Jordan" },
  { flag: "🇰🇿", code: "+7", country: "Kazakhstan" },
  { flag: "🇰🇪", code: "+254", country: "Kenya" },
  { flag: "🇰🇵", code: "+850", country: "North Korea" },
  { flag: "🇰🇷", code: "+82", country: "South Korea" },
  { flag: "🇰🇼", code: "+965", country: "Kuwait" },
  { flag: "🇰🇬", code: "+996", country: "Kyrgyzstan" },
  { flag: "🇱🇦", code: "+856", country: "Laos" },
  { flag: "🇱🇻", code: "+371", country: "Latvia" },
  { flag: "🇱🇧", code: "+961", country: "Lebanon" },
  { flag: "🇱🇸", code: "+266", country: "Lesotho" },
  { flag: "🇱🇷", code: "+231", country: "Liberia" },
  { flag: "🇱🇾", code: "+218", country: "Libya" },
  { flag: "🇱🇮", code: "+423", country: "Liechtenstein" },
  { flag: "🇱🇹", code: "+370", country: "Lithuania" },
  { flag: "🇱🇺", code: "+352", country: "Luxembourg" },
  { flag: "🇲🇴", code: "+853", country: "Macau" },
  { flag: "🇲🇰", code: "+389", country: "Macedonia" },
  { flag: "🇲🇬", code: "+261", country: "Madagascar" },
  { flag: "🇲🇼", code: "+265", country: "Malawi" },
  { flag: "🇲🇾", code: "+60", country: "Malaysia" },
  { flag: "🇲🇻", code: "+960", country: "Maldives" },
  { flag: "🇲🇱", code: "+223", country: "Mali" },
  { flag: "🇲🇹", code: "+356", country: "Malta" },
  { flag: "🇲🇭", code: "+692", country: "Marshall Islands" },
  { flag: "🇲🇶", code: "+596", country: "Martinique" },
  { flag: "🇲🇷", code: "+222", country: "Mauritania" },
  { flag: "🇲🇺", code: "+230", country: "Mauritius" },
  { flag: "🇲🇽", code: "+52", country: "Mexico" },
  { flag: "🇫🇲", code: "+691", country: "Micronesia" },
  { flag: "🇲🇩", code: "+373", country: "Moldova" },
  { flag: "🇲🇨", code: "+377", country: "Monaco" },
  { flag: "🇲🇳", code: "+976", country: "Mongolia" },
  { flag: "🇲🇪", code: "+382", country: "Montenegro" },
  { flag: "🇲🇦", code: "+212", country: "Morocco" },
  { flag: "🇲🇿", code: "+258", country: "Mozambique" },
  { flag: "🇲🇲", code: "+95", country: "Myanmar" },
  { flag: "🇳🇦", code: "+264", country: "Namibia" },
  { flag: "🇳🇷", code: "+674", country: "Nauru" },
  { flag: "🇳🇵", code: "+977", country: "Nepal" },
  { flag: "🇳🇱", code: "+31", country: "Netherlands" },
  { flag: "🇳🇿", code: "+64", country: "New Zealand" },
  { flag: "🇳🇮", code: "+505", country: "Nicaragua" },
  { flag: "🇳🇪", code: "+227", country: "Niger" },
  { flag: "🇳🇬", code: "+234", country: "Nigeria" },
  { flag: "🇳🇴", code: "+47", country: "Norway" },
  { flag: "🇴🇲", code: "+968", country: "Oman" },
  { flag: "🇵🇰", code: "+92", country: "Pakistan" },
  { flag: "🇵🇼", code: "+680", country: "Palau" },
  { flag: "🇵🇸", code: "+970", country: "Palestine" },
  { flag: "🇵🇦", code: "+507", country: "Panama" },
  { flag: "🇵🇬", code: "+675", country: "Papua New Guinea" },
  { flag: "🇵🇾", code: "+595", country: "Paraguay" },
  { flag: "🇵🇪", code: "+51", country: "Peru" },
  { flag: "🇵🇭", code: "+63", country: "Philippines" },
  { flag: "🇵🇱", code: "+48", country: "Poland" },
  { flag: "🇵🇹", code: "+351", country: "Portugal" },
  { flag: "🇵🇷", code: "+1", country: "Puerto Rico" },
  { flag: "🇶🇦", code: "+974", country: "Qatar" },
  { flag: "🇷🇪", code: "+262", country: "Reunion" },
  { flag: "🇷🇴", code: "+40", country: "Romania" },
  { flag: "🇷🇺", code: "+7", country: "Russia" },
  { flag: "🇷🇼", code: "+250", country: "Rwanda" },
  { flag: "🇧🇱", code: "+590", country: "Saint Barthelemy" },
  { flag: "🇰🇳", code: "+1", country: "Saint Kitts and Nevis" },
  { flag: "🇱🇨", code: "+1", country: "Saint Lucia" },
  { flag: "🇲🇫", code: "+590", country: "Saint Martin" },
  { flag: "🇵🇲", code: "+508", country: "Saint Pierre and Miquelon" },
  { flag: "🇻🇨", code: "+1", country: "Saint Vincent and the Grenadines" },
  { flag: "🇼🇸", code: "+685", country: "Samoa" },
  { flag: "🇸🇲", code: "+378", country: "San Marino" },
  { flag: "🇸🇹", code: "+239", country: "Sao Tome and Principe" },
  { flag: "🇸🇦", code: "+966", country: "Saudi Arabia" },
  { flag: "🇸🇳", code: "+221", country: "Senegal" },
  { flag: "🇷🇸", code: "+381", country: "Serbia" },
  { flag: "🇸🇨", code: "+248", country: "Seychelles" },
  { flag: "🇸🇱", code: "+232", country: "Sierra Leone" },
  { flag: "🇸🇬", code: "+65", country: "Singapore" },
  { flag: "🇸🇰", code: "+421", country: "Slovakia" },
  { flag: "🇸🇮", code: "+386", country: "Slovenia" },
  { flag: "🇸🇧", code: "+677", country: "Solomon Islands" },
  { flag: "🇸🇴", code: "+252", country: "Somalia" },
  { flag: "🇿🇦", code: "+27", country: "South Africa" },
  { flag: "🇪🇸", code: "+34", country: "Spain" },
  { flag: "🇱🇰", code: "+94", country: "Sri Lanka" },
  { flag: "🇸🇩", code: "+249", country: "Sudan" },
  { flag: "🇸🇷", code: "+597", country: "Suriname" },
  { flag: "🇸🇪", code: "+46", country: "Sweden" },
  { flag: "🇨🇭", code: "+41", country: "Switzerland" },
  { flag: "🇸🇾", code: "+963", country: "Syria" },
  { flag: "🇹🇼", code: "+886", country: "Taiwan" },
  { flag: "🇹🇯", code: "+992", country: "Tajikistan" },
  { flag: "🇹🇿", code: "+255", country: "Tanzania" },
  { flag: "🇹🇭", code: "+66", country: "Thailand" },
  { flag: "🇹🇱", code: "+670", country: "Timor-Leste" },
  { flag: "🇹🇬", code: "+228", country: "Togo" },
  { flag: "🇹🇴", code: "+676", country: "Tonga" },
  { flag: "🇹🇹", code: "+1", country: "Trinidad and Tobago" },
  { flag: "🇹🇳", code: "+216", country: "Tunisia" },
  { flag: "🇹🇷", code: "+90", country: "Turkey" },
  { flag: "🇹🇲", code: "+993", country: "Turkmenistan" },
  { flag: "🇹🇻", code: "+688", country: "Tuvalu" },
  { flag: "🇺🇬", code: "+256", country: "Uganda" },
  { flag: "🇺🇦", code: "+380", country: "Ukraine" },
  { flag: "🇦🇪", code: "+971", country: "United Arab Emirates" },
  { flag: "🇬🇧", code: "+44", country: "United Kingdom" },
  { flag: "🇺🇸", code: "+1", country: "United States" },
  { flag: "🇺🇾", code: "+598", country: "Uruguay" },
  { flag: "🇺🇿", code: "+998", country: "Uzbekistan" },
  { flag: "🇻🇺", code: "+678", country: "Vanuatu" },
  { flag: "🇻🇦", code: "+379", country: "Vatican City" },
  { flag: "🇻🇪", code: "+58", country: "Venezuela" },
  { flag: "🇻🇳", code: "+84", country: "Vietnam" },
  { flag: "🇻🇬", code: "+84", country: "Virgin Islands British" },
  { flag: "🇻🇮", code: "+1", country: "Virgin Islands US" },
  { flag: "🇾🇪", code: "+967", country: "Yemen" },
  { flag: "🇿🇲", code: "+260", country: "Zambia" },
  { flag: "🇿🇼", code: "+263", country: "Zimbabwe" },
]

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

type PasswordStrength = "weak" | "medium" | "strong" | ""

const MultiStepSignup: React.FC<MultiStepSignupProps> = ({
  switchToLogin,
}) => {
  const navigate = useNavigate()
  const {startSignup,verifyOtp,completeSignup}=useAuth();
  

  
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("")
  const [verificationCode, setVerificationCode] = useState("")
  const [sentCode, setSentCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [codeError, setCodeError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateStep = (step: Step): boolean => {
    const newErrors: FormErrors = {}

    if (step === 2) {
     
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
      if (formData.phone && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }
    } else if (step === 4) {
      
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartUp=async()=>{

    try {
      
    } catch (error) {
      
    }
  
  }

  const handleOTPChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return 

    const otpArray = verificationCode.split("")
    otpArray[index] = value
    const newOTP = otpArray.join("")
    setVerificationCode(newOTP)
    setCodeError("")

    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      prevInput?.focus()
    }
  }

  const handleNextStep = async () => {
  if (validateStep(currentStep)) {
    if (currentStep < 4) {
      if (currentStep === 2) {
        try {
          await startSignup({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: role || "ESTIMATOR",
          })

          
        } catch (err) {
          console.error(err)
        }
      }
      setCurrentStep((currentStep + 1) as Step)
    }
  }
}

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
      setErrors({})
    }
  }

  const handleResetForm = () => {
    setCurrentStep(1)
    setRole(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1",
      phone: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
    setPasswordStrength("")
    setVerificationCode("")
    setSentCode("")
    setIsEmailVerified(false)
    setCodeError("")
  }

  const checkPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return ""

    let strength = 0

    
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    
    if (/[a-z]/.test(password)) strength++

   
    if (/[A-Z]/.test(password)) strength++

    
    if (/[0-9]/.test(password)) strength++

    
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++

    if (strength <= 2) return "weak"
    if (strength <= 4) return "medium"
    return "strong"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
    
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const handleSubmit = async () => {
  if (!validateStep(4)) return

  try {
    await completeSignup(formData.email, formData.password)
    console.log("Account created successfully!");
    handleResetForm() 
  } catch (err: any) {
    console.error("Error creating account:", err)
  }
}


 


React.useEffect(() => {
  if (verificationCode.length === 6) {
    const verifyOTPAsync = async () => {
      try {
        await verifyOtp(formData.email, verificationCode)
        setIsEmailVerified(true)
        setCodeError("")
        setTimeout(() => setCurrentStep(4), 500)
      } catch (err: any) {
        setCodeError(err.message || "Invalid verification code. Please try again.")
        setIsEmailVerified(false)
      }
    }
    verifyOTPAsync()
  }
}, [verificationCode, formData.email, verifyOtp])

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-0 pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border border-slate-200/50 relative z-10 bg-white/95 backdrop-blur-sm">
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.7);
            }
            50% {
              box-shadow: 0 0 0 10px rgba(15, 23, 42, 0);
            }
          }
          .step-active {
            animation: pulse 2s infinite;
          }
          .step-label {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>

        {/* Enhanced Progress Indicator with Animation */}
        <div className="px-6 pt-8 pb-4">
          <div className="relative">
            {/* Background Progress Bar */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full" />
            
            {/* Animated Progress Bar */}
            <div
              className={`absolute top-5 left-0 h-1 bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-full transition-all duration-500 ease-out`}
              style={{
                width: `${((currentStep - 1) / 3) * 100 + 25}%`,
              }}
            />

            <div className="flex items-center justify-between relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    currentStep >= 1
                      ? "bg-gradient-to-br from-slate-900 to-black text-white step-active"
                      : "bg-slate-100 text-slate-600 border-2 border-slate-200"
                  }`}
                >
                  {currentStep > 1 ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <p className={`text-xs font-semibold mt-3 transition-all duration-300 step-label ${
                  currentStep === 1 ? "text-slate-900" : "text-slate-500"
                }`}>
                  Role
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    currentStep >= 2
                      ? "bg-gradient-to-br from-slate-900 to-black text-white step-active"
                      : "bg-slate-100 text-slate-600 border-2 border-slate-200"
                  }`}
                >
                  {currentStep > 2 ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <p className={`text-xs font-semibold mt-3 transition-all duration-300 step-label ${
                  currentStep === 2 ? "text-slate-900" : "text-slate-500"
                }`}>
                  Your Info
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    currentStep >= 3
                      ? "bg-gradient-to-br from-slate-900 to-black text-white step-active"
                      : "bg-slate-100 text-slate-600 border-2 border-slate-200"
                  }`}
                >
                  {currentStep > 3 ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <p className={`text-xs font-semibold mt-3 transition-all duration-300 step-label ${
                  currentStep === 3 ? "text-slate-900" : "text-slate-500"
                }`}>
                  Verify Email
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    currentStep >= 4
                      ? "bg-gradient-to-br from-slate-900 to-black text-white step-active"
                      : "bg-slate-100 text-slate-600 border-2 border-slate-200"
                  }`}
                >
                  {currentStep > 4 ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span>4</span>
                  )}
                </div>
                <p className={`text-xs font-semibold mt-3 transition-all duration-300 step-label ${
                  currentStep === 4 ? "text-slate-900" : "text-slate-500"
                }`}>
                  Password
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-3xl font-bold text-slate-900">
            {currentStep === 1 && "Select Your Role"}
            {currentStep === 2 && "Your Information"}
            {currentStep === 3 && "Verify Your Email"}
            {currentStep === 4 && "Create Password"}
          </CardTitle>
          <p className="text-sm text-slate-500">
            {currentStep === 1 && "Choose the role that best describes you"}
            {currentStep === 2 && "Tell us about yourself"}
            {currentStep === 3 && "Enter the verification code sent to your email"}
            {currentStep === 4 && "Secure your account with a password"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* STEP 1 — ROLE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {["ESTIMATOR", "VIEWER"].map((r) => (
                <div
                  key={r}
                  onClick={() => setRole(r as Role)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center justify-between ${
                    role === r
                      ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                      : "border-slate-200 bg-slate-50 hover:border-slate-900 hover:shadow-md"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{r}</p>
                    <p
                      className={`text-xs mt-1 ${
                        role === r ? "text-slate-100" : "text-slate-500"
                      }`}
                    >
                      {r === "ESTIMATOR" && "Create and manage project estimates"}
        
                      {r === "VIEWER" && "View projects and reports only"}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === r
                        ? "border-white bg-white"
                        : "border-slate-400"
                    }`}
                  >
                    {role === r && (
                      <div className="w-3 h-3 bg-slate-900 rounded-full" />
                    )}
                  </div>
                </div>
              ))}

              {/* Navigation for Step 1 */}
              <Button
                onClick={handleNextStep}
                disabled={!role}
                className="w-full mt-6 bg-gradient-to-br from-slate-900 to-black hover:from-black hover:to-slate-900 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}

          {/* STEP 2 — USER INFO */}
          {currentStep === 2 && (
            <form className="space-y-5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Ntabashwa"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`h-10 rounded-lg border ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Egide"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`h-10 rounded-lg border ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Ntabashwa@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-10 rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone with Country Code */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Phone Number
                  <span className="text-xs text-slate-500 ml-2">(optional)</span>
                </Label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown with Flags */}
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        countryCode: e.target.value,
                      }))
                    }
                    className="h-10 px-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer text-sm font-medium text-slate-700"
                  >
                    {COUNTRY_CODES.map((cc, idx) => (
                      <option key={idx} value={cc.code}>
                        {cc.flag} {cc.code}
                      </option>
                    ))}
                  </select>

                  {/* Phone Input */}
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="555 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`flex-1 h-10 rounded-lg border ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Navigation for Step 2 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-1/3 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-gradient-to-br from-slate-900 to-black hover:from-black hover:to-slate-900 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  Next
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3 — EMAIL VERIFICATION */}
          {currentStep === 3 && (
            <form className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  A verification code has been sent to <br />
                  <span className="font-semibold">{formData.email}</span>
                </p>
              </div>

              {/* OTP 6-Digit Input */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">
                  Verification Code *
                </Label>
                <div className="flex gap-2 justify-between">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={verificationCode[index] || ""}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className={`w-12 h-12 rounded-lg border-2 text-center text-xl font-bold transition-all focus:outline-none ${
                        verificationCode[index]
                          ? "border-slate-900 bg-slate-50"
                          : codeError
                          ? "border-red-500"
                          : "border-slate-200 hover:border-slate-300"
                      } focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20`}
                    />
                  ))}
                </div>
                {codeError && (
                  <p className="text-xs text-red-600 text-center">{codeError}</p>
                )}
              </div>

              {/* Auto-verify message */}
              {verificationCode.length === 6 && !isEmailVerified && (
                <p className="text-xs text-blue-600 text-center">Verifying code...</p>
              )}

              

              {/* Navigation for Step 3 */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4 — PASSWORD */}
          {currentStep === 4 && (
            <form className="space-y-5">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-10 rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <div
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          passwordStrength
                            ? "bg-red-500"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          passwordStrength === "medium" || passwordStrength === "strong"
                            ? "bg-yellow-500"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          passwordStrength === "strong"
                            ? "bg-green-500"
                            : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">Minimum 8 characters</p>
                      <span
                        className={`text-xs font-semibold ${
                          passwordStrength === "weak"
                            ? "text-red-600"
                            : passwordStrength === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength === "weak" && "Weak"}
                        {passwordStrength === "medium" && "Medium"}
                        {passwordStrength === "strong" && "Strong"}
                      </span>
                    </div>
                  </div>
                )}
                
                {!formData.password && (
                  <p className="text-xs text-slate-500">Minimum 8 characters</p>
                )}
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-slate-700 font-medium"
                >
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`h-10 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Navigation for Step 4 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-1/3 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-br from-slate-900 to-black hover:from-black hover:to-slate-900 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

         
          <p className="text-sm text-center text-slate-600 pt-6">
            Already have an account?{" "}
            <span
              onClick={switchToLogin}
              className="text-slate-900 cursor-pointer font-semibold hover:underline"
            >
              Sign In
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default MultiStepSignup
