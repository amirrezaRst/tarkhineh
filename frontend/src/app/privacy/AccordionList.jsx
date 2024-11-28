"use client";

import Accordion from "@/components/Accordion";
import { PrivacyList } from "@/constant/privacyList";
import { useState } from "react";

const AccordionList = () => {
    const [isOpen, setIsOpen] = useState(null);

    
    return ( 
        <section className="container mt-12 mb-16">

                {/*//! START Items List */}
                <div className="border border-[#CBCBCB]/70 rounded-lg divide-y divide-[#CBCBCB]/60">

                    {PrivacyList.map((item, index) =>
                        <Accordion key={index} title={item.title} description={item.description} index={index} isOpen={isOpen} setIsOpen={setIsOpen} />
                    )}

                </div>

            </section>
     );
}

export default AccordionList;