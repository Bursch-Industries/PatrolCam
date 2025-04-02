// contact form for PatrolCam
'use client'; 
import { useState } from "react";


export default function ContactForm() {
    // state for form data that will be sent to the backend
    const [formInfo, setFormInfo] = useState({
        contactName: (''),
        organization: (''),
        phoneNumber : (''),
        email: (''),
        productInterest: ('Surveillance Cameras'),
        extension: ('')
    });

    
    function HandleName(e){
        setFormInfo({
            ...formInfo,
            contactName: e.target.value,
        });
    }
    
    function HandleOrg(e){
        setFormInfo({
            ...formInfo,
            organization: e.target.value,
        });
    }

    function EnforceFormat(e){
        // Allows numeric input in phone number field
        
        const isNumericInput = (e) => {
            const key = e.keyCode;
            return ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105) // Allow number pad
        )};
    
    // Allows modifier keys to be used in phone number field
    const isModifierKey = (e) => {
        const key = e.keyCode;
        return (e.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (e.ctrlKey === true || e.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
    };
    
    // Combines the allowed keys into one event
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if(!isNumericInput(e) && !isModifierKey(e)){
        e.preventDefault();
    };
    
    // Formats the input into desired structure
    if(isModifierKey(e)) {return;}
    
    const input = e.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
    const areaCode = input.substring(0,3);
    const middle = input.substring(3,6);
    const last = input.substring(6,10);
    
    if(input.length > 6){e.target.value = `(${areaCode}) - ${middle} - ${last}`;}
    else if(input.length > 3){e.target.value = `(${areaCode}) - ${middle}`;}
    else if(input.length > 0){e.target.value = `(${areaCode}`;}
    
}

    function HandlePhoneNumber(e){
        setFormInfo({
            ...formInfo,
            phoneNumber: e.target.value,
        });
    }

    function HandleExtension(e) {
        setFormInfo({
            ...formInfo,
            extension: e.target.value,
        })
    }

    function HandleEmail(e){
        setFormInfo({
            ...formInfo,
            email: e.target.value,
        });
    }

    function HandleProductInterest(e){
        // logic for handling product interest selection
        setFormInfo({
            ...formInfo,
            productInterest: e.target.value,
        });
    }


    // make async function
    async function HandleFormSubmission(e){
        e.preventDefault(); // prevent the default submission

        let isInvalid = false;

        // Used for testing
        console.log(formInfo);

        Object.entries(formInfo).forEach( ([key, value]) => {
            // Skip validation for the 'extension' field
            if (key === 'extension') return;

            if (String(value).trim() === ''){
                isInvalid = true;
                console.log(key, 'form contains empty input field');
                // TODO: add red border to invalid input field
            } else {
                console.log('form is good for submission')
                // TODO: add green border to all valid input fields or show success
            }
        });

        if (isInvalid){
            return; // form submission has invalid properties, stop execution
        } else {
            try {
                const requestBody = formInfo;
                const response = await fetch('/api/auth/emailAPI', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok){
                    console.log('An error has occured');
                    return; // problem with response, stop execution
                }
                 
                console.log('response is successful email has been sent');
            } catch (error) {
                console.error('Error: ', error);
            }
        }
    }

    
    return (
        // contact section container
        <section id="contact-us" className="flex bg-[#145DA0] justify-center">
            {/* form container */}
            <div className="bg-[#B1D4E0] mt-[1.5rem] mb-[1.5rem] py-[1.875rem] px-20 rounded-[1.3rem] shadow-lg">
                <h1 className="text-center text-[2.25rem] underline font-bold text-[#3650FF]">
                    Get In Touch
                </h1>
                <p className="text-primary text-center text-[1.5625rem] ">Let us know what you are interested in</p>

                <form id="contactForm" onSubmit={HandleFormSubmission}>
                    <input
                        type="text"
                        placeholder="Contact Name"
                        value={formInfo.contactName}
                        onChange={HandleName}
                        className="bg-white rounded-md w-[100%] pl-2 mt-2 mb-4 py-2 shadow-lg"
                    />
                    <input
                        type="text"
                        placeholder="Organization"
                        value={formInfo.organization}
                        onChange={HandleOrg}
                        className="bg-white rounded-md w-[100%] pl-2 py-2 shadow-lg"
                    />
                    <div className="flex justify-between mt-4">
                        <input
                            type="text"
                            placeholder="Ext. (optional)"
                            value={formInfo.extension}
                            onChange={HandleExtension}
                            className="bg-white rounded-md pl-2 py-2 w-[30%] mr-1 shadow-lg"
                        />
                        <input 
                            type="text"
                            placeholder="Phone Number"
                            value={formInfo.phoneNumber}
                            onKeyDown={EnforceFormat}
                            onChange={HandlePhoneNumber}
                            maxLength="18"
                            className="bg-white rounded-md pl-2 py-2 w-[70%] ml-1 shadow-lg"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={formInfo.email}
                        onChange={HandleEmail}
                        className="bg-white rounded-md w-[100%] pl-2 py-2 mt-4 mb-4 shadow-lg"
                    />
                    <label htmlFor="productInterest" className="block text-center text-2xl "> What product are you interested in? </label>
                    <select value={formInfo.productInterest} onChange={HandleProductInterest} className="bg-white rounded-md pl-2 py-2 mt-1 w-[100%] shadow-lg">
                        <option value="Surveillance Cameras"> Surveillance Cameras</option>
                        <option value="Option-2"> Option 2</option>
                        <option value="Option-3"> Option 3</option>
                        <option value="Other"> Other</option>
                    </select>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-primary text-white text-lg px-8 py-2 rounded-md hover:bg-blue-900 shadow-lg transition-normal">Submit</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
