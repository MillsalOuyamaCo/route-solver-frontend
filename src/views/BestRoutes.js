import React from "react";

// core components
import PanelHeaderWithImage from "components/PanelHeader/PanelHeaderWithImage.js";

function BestRoutes() {
    let pageHeader = React.createRef();

    return (
        <>
            <PanelHeaderWithImage
                content={
                    <div
                        className="image-white text-center"
                        style={{
                            backgroundImage: "url(" + require("assets/img/best-routes.jpg") + ")",
                        }}
                        ref={pageHeader}
                    >
                        <h2 className="title">Melhores Rotas</h2>
                    </div>
                }
            />
            <div className="content">

            </div>
        </>
    );
}

export default BestRoutes;