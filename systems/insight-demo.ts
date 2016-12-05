import PoetInsightListener from './insight'

const addr = 'mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C'
const insight = 'test-insight.bitpay.com'

const system = new PoetInsightListener(insight, addr)
system.suscribe(hash => {
    console.log('New hash discovered', hash)
})

// Priv: 343689da46542f2af204a3ced0ce942af1c25476932aa3a48af5e683df93126b
// Pub: 03155e888e65e9304d8139cc34007c86db3adde6d7297cd31f7f7f6fdd42dfb4dc
// Addr: mg6CMr7TkeERALqxwPdqq6ksM2czQzKh5C