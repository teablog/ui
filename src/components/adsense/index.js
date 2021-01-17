import React, { useEffect } from "react";

const AdSense = ({ style, format, layoutKey, client, slot, responsive }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.log(err);
        }
    }, []);
    const props = {}
    if (style !== "") {
        props["style"] = style
    }
    if (format !== "") {
        props["data-ad-format"] = format
    }
    if (layoutKey !== "") {
        props["data-ad-layout-key"] = layoutKey
    }
    if (client !== "") {
        props["data-ad-client"] = client
    }
    if (slot !== "") {
        props["data-ad-slot"] = slot
    }
    if (responsive != "") {
        props["data-full-width-responsive"] = responsive
    }
    return (
        <ins
            style={{
                display: "block"
            }}
            data-ad-client={ }
            data-ad-slot={ }
        />
    );
};

export default AdSense