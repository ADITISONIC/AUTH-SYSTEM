import React from 'react'

function PasswordCriteria({password}) {
    const criteria = [
        {label:"At least 6 characters",met:password.length>=6},
        {label:"Contains uppercase letter",met:/[A-Z]/.test(password)},
        {label:"Contains lowercase letter",met:/[a-z]/.test(password)},
        {label:"Contains a number",met:/\d/.test(password)},
        {label:"Contains special character",met:/[^A-Za-z0-9]/.test(password)}
    ]
  return (
    <div className='mt-2 space-y-1'>
    {
        criteria.map((criterion,index)=>(
            
        ))
    }
    </div>
  )
}

export default PasswordStrengthMeter