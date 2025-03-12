# Subscription Strategy

This repository contains code demonstrating how to use one of the paid account creation strategies, specifically the subscription strategy. The client is charged a fee and is granted access to the account for a specified period. After the term expires, access to the account will be blocked until the subscription is renewed. Subscription duration, price, etc., can be configured.

# Deployment

```shell
chr deployment create --settings chromia.yml --network testnet --blockchain my_rell_dapp_test_3
This will create a new deployment of my_rell_dapp_test_1 on network testnet. Would you like to create a new deployment? [y/N]: y
Deployment of blockchain my_rell_dapp_test_1 was successful
Add the following to your project settings file:
deployments:
  testnet:
    chains:
      my_rell_dapp_test_3: x"840B208BD2B1BC04C66F70D730DEF676F2D93A9565EB21442CE8DBDD4ECB11CF"
```
## Create Alice and Trudy accounts
```shell
chr keygen --dry 
mnemonic:  solar into blind ignore valve knife electric manage panther universe scene zone afraid segment private undo brain real aunt march require awful agree end 
pubkey:    025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245
privkey:   77FEFD5C7E49E16A1744001F0838D4CF191A66BD9A5F45FDD36CC9120440100A

chr keygen --dry
mnemonic:  banana snap only soon club cheese knee pigeon wheat design zone display jealous draw add garlic enough couch paddle march sad win dismiss venue 
pubkey:    032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56
privkey:   0579695EAE57192B5A4C848E31183A7F875BEFC53D7184126DA8C19BE5A2A7D3
```
## Create user for Alice & mint tokens
```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % chr tx create_user_mint_tokens 025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245 --await --secret testnet_container_key.key --network testnet --blockchain my_rell_dapp_test_3
transaction with rid CAE955BB4D7F8902612981BF07FE38C6D34509B52CD6CCFDC78D0C058DF28A70 was posted CONFIRMED
```
## Get alice's account id
```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % chr query get_last_account --network testnet --blockchain my_rell_dapp_test_2
2
```
## Shasum Trudy's pubkey ( i guess this is her account id but i'm not sure )
```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % echo 032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56 | xxd -r -p | shasum -a 256
21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501  -
```
## Transfer tokens to non-existent account
```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % chr tx transfer_tokens 2 x\"21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501\" 1 100L --await --secret testnet_container_key.key --network testnet --blockchain my_rell_dapp_test_3
transaction with rid BCFD9565CA58A041F35E0C154535117EE3D6C6D15BA8A4B35D34AC2A7A5ABB08 was posted CONFIRMED
```



## Run script on client side
```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % node test-suites/index.js

=== Starting Subscription Notes Test ===
Checking Pending Transfer Strategies
Pending Transfer Strategies (ft4.get_pending_transfer_strategies): [ 'subscription' ]
Strategies: [ 'subscription' ]
Checking Pending Create Account Transfer For Strategy
Pending Create Account Transfer Status: 0
isPending 0
Registering Account with Subscription
Error registering account with subscription: Unexpected status code from server. Code: 400. Message: [lib.ft4.core.auth:get_auth_handler(lib/ft4/core/auth/module.rell:58)] Query 'ft4.get_auth_handler_for_operation' failed: Cannot find auth handler for operation <ft4.ras_transfer_subscription>.

=== Subscription Notes Test Completed Successfully ===
```




