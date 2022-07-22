import React from 'react';
import { Grid, Container, Form, Header, Message } from 'semantic-ui-react'
import { faucetRequest } from './api';
function App() {

    // Component State Handler
    /**
     * @property {String} address - Address to make API request with
     * @property {String} error - Error that ocurred from funding API call if any
     * @property {Boolean} loading - Is the API Call in progress?
     * @property {Boolean} success - Was the API Call a success? ( No errors in res.data, etc ) 
     */
    let [componentState, setComponentState] = React.useState({
        address: "0xc113189ad606c8dd46a783a7915483d7e9461c9a",
        error: "",
        loading: "",
        success: ""
    });
    const updateComponentState = (stateUpdates) => setComponentState(s => ({ ...s, ...stateUpdates }));

    /**
     * Submit an api request for funding with current local address state
     */
    const submitFaucetRequest = async () => {
        if (!componentState.address) {
            return updateComponentState({ error: "An address is required" })
        }
        updateComponentState({ loading: true, success: "", error: "" });
        let apiRes = await faucetRequest(componentState.address);
        if (apiRes.error) {
            updateComponentState({ error: apiRes.error, success: false });
        } else {
            updateComponentState({ error: false, success: true });
        }
        updateComponentState({ loading: false });
    }

    const ResultMessage = () => componentState.success || componentState.error ? componentState.success ? (
        <Message success>
            Funding request successful for {componentState.address}
        </Message>
    ) : (
        <Message error>
            {componentState.error.toLocaleUpperCase()}
        </Message>
    ) : null;

    return (
        <Grid columns="1">
            <Grid.Column>
                <Container className="mt-20">

                    <Header content="AliceNet Faucet" subheader={"For the layer 2 alice network served at: " + process.env.REACT_APP_ALICENET_RPC_ENDPOINT} />

                    <Form>
                        <Form.Input
                            error={!!componentState.error}
                            size="huge"
                            value={componentState.address}
                            placeholder="0x0"
                            action={{
                                position: "right",
                                content: "Submit",
                                color: "blue",
                                size: "huge",
                                onClick: submitFaucetRequest,
                                loading: !!componentState.loading
                            }}
                            onChange={e => updateComponentState({ address: e.target.value })}
                        />
                    </Form>

                    {componentState.loading && <Header as="h5" color="grey" content="Please wait funding in progress ..." />}

                    <ResultMessage />

                </Container>
            </Grid.Column>
        </Grid >
    );
}

export default App;
