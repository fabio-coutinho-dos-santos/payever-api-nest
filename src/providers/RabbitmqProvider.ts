import { Connection, Channel, connect, Message } from "amqplib";

export class RabbitmqProvider{

    private connection: Connection
    private channel: Channel
    constructor(private uri: string){}

    async start() : Promise<void> {
        this.connection = await connect(this.uri)
        if(!this.connection){
            // throw new InternalServerErrorException('Error on connect with rabbitmq');

            // to simulate without a real connection
        } 
        this.channel = await this.connection.createChannel()
    }

    async publishInQueue(queue: string, message: string): Promise<boolean>{
        return this.channel.sendToQueue(queue, Buffer.from(message))
    }

    async consume(queue: string, callback: (message: Message) => void){
        return this.channel.consume(queue, (message)=>{
            callback(message)
            this.channel.ack(message);
        })
    }

    async publishInExchange(exchage: string, routeingKey: string, message: string): Promise<boolean>{
        return this.channel.publish(exchage, routeingKey, Buffer.from(message))
    }

}