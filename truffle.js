module.exports = {
    networks: {
      inhouse: {
        host: "172.17.2.166",
        port: 8545,
        network_id: "*",
        gas:4712388,
        from:"0x3975cdecd9c2977a1e4986677c9a34ff33e3ef00",
        solc: { optimizer: { enabled: true, runs: 200 } }
      },
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*" 
      },
      test: {
        host: "172.17.2.50",
        port: 8545,
        network_id: "*" 
      }
    },
    mocha: {
      enableTimeouts: false
    }
  };
  