import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';
const AutoInc = require('mongoose-sequence')(mongoose);
const Schema = new mongoose.Schema({
    userId:{
        type:Number,
        unique:true
    },
    originalUrl :{
    type:String,
    required:true,
    unique:true
    },
    shortenUrl:{
        type:String,
        required:true,
        unique:true
    },
    alias:{
        type:String,
        unique:true
    },
    accesses:{
        type:Number,
        default:0
    },
    timestamps:
        [Date],
});

Schema.plugin(AutoInc, { inc_field: 'userId' });

module.exports = mongoose.model('user', Schema);