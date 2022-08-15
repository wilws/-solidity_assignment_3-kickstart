import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';


class CampaignShow extends Component {
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
        };
    }

    renderCards(){

        const {            
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;


        const items = [
            {
              header: manager,
              description:
                'The manager created this campaign and can create requests to withdraw money',
              meta: 'Address of Manager',
              style:{ overflowWrap: 'break-word'}
            },
            {
              header: minimumContribution,
              description:
                'You must contribute at least this much wei to became a approver',
              meta: 'Minimum Contribution (wei)',
            },
            {
              header: requestsCount,
              description:
                'A request tries to withdraw money from the contract. Request must be approved by approver',
              meta: 'Number of Requests',
            },
            {
                header: approversCount,
                description:
                    'Number of people who have already donated to the campaign ',
                meta: 'Number of Approvers',
            },
            {
                header: web3.utils.fromWei(balance,'ether'),
                description:
                    'The balance is how much money this campaign has left to spend',
                meta: 'Campaign Balance (ethere)',
            },
          ];

        return <Card.Group items={items} />
    }


    render(){
        return(
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                          
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                    <Grid.Column>
                    <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                            </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;