import { dateParser } from '@/functions/utils'
import React from 'react'
import styled from 'styled-components'

interface Props {
    item: any
}

const TimelineItems = ({ item }: Props) => {

    return (
        <TimelineItem>
            {item.type === 'payment_status' &&
                <>
                    {item.status === 'awaiting' &&
                        <div className='title'>
                            Paiement en attente de validation
                        </div>
                    }
                    {item.status === 'canceled' &&
                        <div className='title'>
                            Paiement annulé
                        </div>
                    }
                    {item.status === 'paid' &&
                        <div className='title'>
                            Paiement accepté
                        </div>
                    }
                    <div className='txt-sec'>
                        {dateParser(item.date)}, {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </>
            }
            {item.type === 'order_status' &&
                <>
                    {item.status === 'accepted' &&
                        <div className='title'>
                            Commande acceptée
                        </div>
                    }
                    {item.status === 'preparation' &&
                        <div className='title'>
                            Commande en préparation
                        </div>
                    }
                    {item.status === 'completed' &&
                        <div className='title'>
                            Commande terminée
                        </div>
                    }
                    {item.status === 'shipped' &&
                        <div className='title'>
                            Commande envoyée
                        </div>
                    }
                    {item.status === 'canceled' &&
                        <div className='title'>
                            Commande annulée
                        </div>
                    }
                    <div className='txt-sec'>
                        {dateParser(item.date)}, {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {item?.user &&
                        <div className='mt-2'>
                            {`Par ${item.user.name} ${item.user.lastname}`}
                        </div>
                    }
                </>
            }
            {item.type === 'message' &&
                <>
                    <div className='title'>
                        {item.user.name} {item.user.lastname}
                    </div>
                    <div className='txt-sec'>
                        {dateParser(item.date)}, {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className='message'>
                        {item.message}
                    </div>
                </>
            }
        </TimelineItem>
    )
}

export default TimelineItems

const TimelineItem = styled.div`
    position : relative;
    width    : 100%;
    height   : auto;
    padding  : 20px 20px 0 40px;

    .title {
        font-weight : 500;
    }

    .message {
        display          : inline-block;
        padding          : 8px 12px;
        border-radius    : var(--rounded-sm);
        background-color : var(--bg-one);
        margin-top       : 8px;
    }

    &:before {
        content       : '';
        position      : absolute;
        left          : 16px;
        top           : 24px;
        width         : 10px;
        height        : 10px;
        background    : var(--primary);
        border-radius : var(--rounded-full);
    }

    &:after {
        content    : '';
        position   : absolute;
        left       : 20px;
        top        : 40px;
        width      : 2px;
        height     : calc(100% - 25px);
        background : var(--light-border);
    }

    &:last-child {
        padding-bottom : 20px;
    
        &:after {
            content : none;
        }
    }
`