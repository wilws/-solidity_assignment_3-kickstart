import React ,{Component}from "react";
import { Card, Button } from "semantic-ui-react";
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    // use of static :
    // if you dont use "static", you call a mehtod in class like : 
    //  const a = new CampaignIndex()
    //  a.render()
    //
    //  if you put static at the beginning, you can directly call the method without making instance
    //  CampaignIndex.render()


    static async getInitialProps(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns}

    }

    renderCampaigns(){
        const items = this.props.campaigns.map(address =>{
            return{
                header: address,
                description: (
                <Link route={`/campaigns/${address}`}>
                    <a>View Campaign</a>
                </Link>),
                fluid: true
            }
        });

        return <Card.Group  items={items} />

    }

    render(){
        return (
            <Layout>
                <div>
      
                
                <h3>Open Campaign</h3>
                
                <div>
                    <Link route="/campaigns/new">
                    <a>
                    <Button 
                        floated="right" 
                        content='Create Project' 
                        icon='add circle' 
                        primary={true} 
                    />
                    </a>
                    </Link>
                </div>
                {this.renderCampaigns()}
                </div>
                </Layout>
            )
    }
}


export default CampaignIndex;