// contact form for PatrolCam
'use client'; 


export default function ContactForm() {

    return (
        // contact section container
        <section id="contact-us" className="flex bg-[#145DA0] justify-center">
            {/* form container */}
            <div className="bg-[#B1D4E0] mt-[1.5rem] mb-[1.5rem] py-[1.875rem] px-20 rounded-[1.3rem]">
                <h1 className="text-center text-[2.25rem] font-bold text-[#3650FF]">
                    Get In Touch
                </h1>
                <p className="text-primary text-center text-[1.5625rem] ">Let us know what you are interested in</p>

                <form>
                    <input
                        //id="name" 
                        type="text"
                        placeholder="Contact Name"
                        //name="name"
                        className="bg-white rounded-md w-[100%] pl-2 mt-2 mb-4 py-2"
                    />
                    <input
                        //id="organization"
                        type="text"
                        placeholder="Organization"
                        //name="org"
                        className="bg-white rounded-md w-[100%] pl-2 py-2"
                    />
                    <div className="flex justify-between mt-4">
                        <input
                            //id="extension" 
                            type="text"
                            placeholder="Extension (optional)"
                            //name="ext"
                            className="bg-white rounded-md pl-2 py-2 w-[50%] mr-1"
                        />
                        <input 
                            //id="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            //name="phone"
                            maxLength="18"
                            className="bg-white rounded-md pl-2 py-2 w-[50%] ml-1"
                        />
                    </div>
                    <input
                        //id="email"
                        type="email"
                        placeholder="E-mail"
                        //name="email"
                        className="bg-white rounded-md w-[100%] pl-2 py-2 mt-4 mb-4"
                    />
                    <label htmlFor="productInterest" className="block text-center text-2xl"> What product are you interested in? </label>
                    <select id="productInterest" /* name="productInterest" */ className="bg-white rounded-md pl-2 py-2 mt-1 w-[100%]">
                        <option value="option-1"> Surveillance Cameras</option>
                        <option value="option-2"> Option 2</option>
                        <option value="option-3"> Option 3</option>
                        <option value="option-4"> Other</option>
                    </select>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-primary text-white text-lg px-8 py-2 rounded-md">Submit</button>
                    </div>
                </form>
            </div>
        </section>
    )
}
