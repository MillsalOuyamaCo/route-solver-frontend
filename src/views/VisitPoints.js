import React from "react";

// core components
import PanelHeaderWithImage from "components/PanelHeader/PanelHeaderWithImage.js";

function VisitPoints() {
    let pageHeader = React.createRef();

    return (
        <>
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={{
                            backgroundImage: "url(" + require("assets/img/visit-points.jpg") + ")",
                        }}
                        ref={pageHeader}
                    >
                        <h2 className="title">Pontos de Visita</h2>
                    </div>
                }
            />
            <div className="content">

            </div>
        </>
    );
}

export default VisitPoints;