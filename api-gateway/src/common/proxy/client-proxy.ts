import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClientProxySuperFlights{
    constructor(private readonly config:ConfigService){}
}