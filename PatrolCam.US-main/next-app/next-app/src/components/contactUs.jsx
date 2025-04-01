// contact form for PatrolCam
'use client'; 
import { useState } from "react";


export default function ContactForm() {
    // state for form data that will be sent to the backend
    const [formData, setFormData] = useState({
        contactName: (''),
        organization: (''),
        phoneNumber : 0,
        email: (''),
        productInterest: (''),
    });


    // make async function
    function HandleSubmission(e){
        e.preventDefault();
    }

    function HandleName(e){
        setFormData( prev => ({
            ...prev,
            contactName: e.target.value,
        }));
    }

    function HandleOrg(e){
        setFormData( prev => ({
            ...prev,
            organization: e.target.value,
        }));
    }

    function HandlePhoneNumber(e){
        // logic for handling formatting and state of user phone number
    }

    function HandleEmail(e){
        // logic for handling state of inputted email
    }

    function HandleProductInterest(e){
        // logic for handling product interest selection
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

                <form onSubmit={HandleSubmission}>
                    <input
                        type="text"
                        placeholder="Contact Name"
                        onChange={HandleName}
                        className="bg-white rounded-md w-[100%] pl-2 mt-2 mb-4 py-2 shadow-lg"
                    />
                    <input
                        type="text"
                        placeholder="Organization"
                        onChange={HandleOrg}
                        className="bg-white rounded-md w-[100%] pl-2 py-2 shadow-lg"
                    />
                    <div className="flex justify-between mt-4">
                        <input
                            type="text"
                            placeholder="Extension (optional)"
                            className="bg-white rounded-md pl-2 py-2 w-[50%] mr-1 shadow-lg"
                        />
                        <input 
                            type="text"
                            placeholder="Phone Number"
                            maxLength="18"
                            className="bg-white rounded-md pl-2 py-2 w-[50%] ml-1 shadow-lg"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="bg-white rounded-md w-[100%] pl-2 py-2 mt-4 mb-4 shadow-lg"
                    />
                    <label htmlFor="productInterest" className="block text-center text-2xl "> What product are you interested in? </label>
                    <select className="bg-white rounded-md pl-2 py-2 mt-1 w-[100%] shadow-lg">
                        <option value="option-1"> Surveillance Cameras</option>
                        <option value="option-2"> Option 2</option>
                        <option value="option-3"> Option 3</option>
                        <option value="option-4"> Other</option>
                    </select>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-primary text-white text-lg px-8 py-2 rounded-md hover:bg-blue-900 shadow-lg transition-normal">Submit</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
