// This file is autogenerated by Redwood and will be overwritten periodically

import { db } from 'src/lib/db'
import datamodel from 'src/models/datamodel'
import { RedwoodRecord } from '@redwoodjs/record'

RedwoodRecord.db = db
RedwoodRecord.schema = datamodel

import User from 'src/models/User'


export { User }
