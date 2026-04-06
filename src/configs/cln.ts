import * as fs from 'fs'
import * as grpc from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'

const loadMTLSCredentials = (
  tlsLocation: string,
  tlsKeyLocation: string,
  tlsChainLocation: string
): grpc.ChannelCredentials => {
  const glCert = fs.readFileSync(tlsLocation)
  const glPriv = fs.readFileSync(tlsKeyLocation)
  const glChain = fs.readFileSync(tlsChainLocation)
  return grpc.credentials.createSsl(glCert, glPriv, glChain)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function loadCln(
  tlsLocation: string,
  tlsKeyLocation: string,
  tlsChainLocation: string,
  clnUri: string
): Promise<any> {
  const credentials = loadMTLSCredentials(
    tlsLocation,
    tlsKeyLocation,
    tlsChainLocation
  )

  const packageDefinition = loadSync('proto/cln.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
  const descriptor = grpc.loadPackageDefinition(packageDefinition)
  const cln = descriptor.cln as grpc.GrpcObject
  const options = {
    'grpc.ssl_target_name_override': 'localhost',
  }
  const Node = cln.Node as typeof grpc.Client
  const lightningClient = new Node(clnUri, credentials, options)
  return lightningClient
}
// amount_msat: { value: 100000 }, label: "invoice 1"
// async function getInfo() {
//   console.log('===> Trying to see when this logs to the console')
//   const lightning = await loadCln()
//   lightning.invoice(
//     {
//       amount_msat: { amount: { msat: '12' } },
//       label: 'Besting all the way121211qwe',
//       description: 'Happu to do this',
//     },
//     (err: any, response: any) => {
//       if (err) {
//         console.log(err)
//         return
//       }
//       if (response && response) {
//         console.log(response)
//         console.log('No address')
//         return
//       }
//       console.log(response)
//     }
//   )
// }

// getInfo()
