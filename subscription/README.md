# Readme

This repository contains code demonstrating how to use one of the paid account creation strategies, specifically the subscription strategy. The client is charged a fee and is granted access to the account for a specified period. After the term expires, access to the account will be blocked until the subscription is renewed. Subscription duration, price, etc., can be configured.

## Steps for Setting Up Subscription and Account Registration

1. Configure Cromia.yaml
   
2. Create an asset.

3. Mint assets.

4. Transfer assets to a non-existing account with a minimally configured amount.

5. Register the account.

## Additional CLI commands

| Command Name                                  | Command                                                                                                                                                                                                 | Parameter Description                                                                                                                      |
|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Register Asset                                | `chr tx ft4.admin.register_asset <AssetName> TST 6 https://url-to-asset-icon --secret .chromia/ft4-admin.keypair --await`                                                                               |             `<AssetName>`: The name of the new asset<br>`TST`: The asset's code<br>`6`: The decimal precision of the asset<br>`https://url-to-asset-icon`: URL to the asset icon<br>`--secret .chromia/ft4-admin.keypair`: Path to the file containing the secret key |
| Mint                                          | `chr tx ft4.admin.mint 5E2488889F72939DD4D0A034FB91893ACBF14C7EDBCEF2A9F5C621A07169EAD2 85506832C77AFDDB17DE1D175BAEE949C9248578E06CAC3EC7B59AA69C7C69B0 100000000L --await --secret .chromia/ft4-admin.keypair` | `5E2488889F72939DD4D0A034FB91893ACBF14C7EDBCEF2A9F5C621A07169EAD2`: The recipient address<br>`85506832C77AFDDB17DE1D175BAEE949C9248578E06CAC3EC7B59AA69C7C69B0`: The asset ID<br>`100000000L`: Amount to mint |
| Get Pending Transfer Strategies               | `chr query ft4.get_pending_transfer_strategies recipient_id=7CD90DBE3D3A9C74D45671FA5FD30B8A7C367F7227B32F1F8A0021E656FFB9C4`                                                                           | `recipient_id=7CD90DBE3D3A9C74D45671FA5FD30B8A7C367F7227B32F1F8A0021E656FFB9C4`: The recipient address for which to query pending transfer strategies |
| Has Pending Create Account Transfer for Strategy | `chr query ft4.has_pending_create_account_transfer_for_strategy strategy_name=subscription sender_blockchain_rid=03C8D12D9D3DD97DA5A20A569DA5E25E81C9C8DB44BBDB1BE798D9F1B695420BBD sender_id=5E2488889F72939DD4D0A034FB91893ACBF14C7EDBCEF2A9F5C621A07169EAD2 recipient_id=7CD90DBE3D3A9C74D45671FA5FD30B8A7C367F7227B32F1F8A0021E656FFB9C4 asset_id=99FFDC13F4675DA488F8C2229E30B05FD6C25EA6E09C30FDBBD8B44B2E9294B9 amount=10000000L` | `strategy_name=subscription`: The name of the strategy<br>`sender_blockchain_rid=03C8D12D9D3DD97DA5A20A569DA5E25E81C9C8DB44BBDB1BE798D9F1B695420BBD`: The sender's blockchain RID<br>`sender_id=5E2488889F72939DD4D0A034FB91893ACBF14C7EDBCEF2A9F5C621A07169EAD2`: The sender's ID<br>`recipient_id=7CD90DBE3D3A9C74D45671FA5FD30B8A7C367F7227B32F1F8A0021E656FFB9C4`: The recipient's ID<br>`asset_id=99FFDC13F4675DA488F8C2229E30B05FD6C25EA6E09C30FDBBD8B44B2E9294B9`: The asset ID<br>`amount=10000000L`: The amount to transfer |
| Get Subscription Details                      | `chr query ft4.get_subscription_details account_id=sender_blockchain_rid=03C8D12D9D3DD97DA5A20A569DA5E25E81C9C8DB44BBDB1BE798D9F1B695420BBD`                                                             | `account_id=sender_blockchain_rid=03C8D12D9D3DD97DA5A20A569DA5E25E81C9C8DB44BBDB1BE798D9F1B695420BBD`: The sender's blockchain |

## Deployment

```shell
chr deployment create --settings chromia.yml --network testnet --blockchain my_rell_dapp_test_4
This will create a new deployment of my_rell_dapp_test_1 on network testnet. Would you like to create a new deployment? [y/N]: y
Deployment of blockchain my_rell_dapp_test_1 was successful
Add the following to your project settings file:
deployments:
  testnet:
    chains:
      my_rell_dapp_test_1: x"13E3589536325FE0434759C878650D57869941E5C61D114218669A2F60062450"
```
Alice's key pair:
```shell
chr keygen --dry 
mnemonic:  solar into blind ignore valve knife electric manage panther universe scene zone afraid segment private undo brain real aunt march require awful agree end 
pubkey:    025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245
privkey:   77FEFD5C7E49E16A1744001F0838D4CF191A66BD9A5F45FDD36CC9120440100A
```

Trudy's key pair:
```shell
chr keygen --dry
mnemonic:  banana snap only soon club cheese knee pigeon wheat design zone display jealous draw add garlic enough couch paddle march sad win dismiss venue 
pubkey:    032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56
privkey:   0579695EAE57192B5A4C848E31183A7F875BEFC53D7184126DA8C19BE5A2A7D3
```

Bob's key pair:
```shell
chr keygen --dry
mnemonic:  minute use hybrid tornado cream fox bus runway toss spoon orbit control tilt slow reject effort dutch welcome smart apology glide pelican today muffin 
pubkey:    0344B01C942B11CFBE7DD0498AF40929B0750BF540115B75EE70685930E4DC7438
privkey:   05C6E6FAD1FDD30162768C8FF0598663CF122BDF5912772D05AD06983DD1BBEA
```

```shell
hienhoangminh@Hiens-MacBook-Air-6 subscription % chr tx create_user_mint_tokens 025B4C63A26BFF65E922693EDA2F13EE67E85CD4D4B5F8CEB2F5DC1E399FC6F245 --await --secret testnet_container_key.key --network testnet --blockchain my_rell_dapp_test_3
transaction with rid CAE955BB4D7F8902612981BF07FE38C6D34509B52CD6CCFDC78D0C058DF28A70 was posted CONFIRMED

hienhoangminh@Hiens-MacBook-Air-6 subscription % chr query get_last_account --network testnet --blockchain my_rell_dapp_test_2
2

hienhoangminh@Hiens-MacBook-Air-6 subscription % echo 032E524E37357AE1D1F296900BC761DC044C15FD7E037840D5FB9DF7AF9550AC56 | xxd -r -p | shasum -a 256
21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501  -


hienhoangminh@Hiens-MacBook-Air-6 subscription % chr tx transfer_tokens 2 x\"21ea4a7dcb14c278edb957e2927965f8bbfc9ae73c51873a19e73ac19ad56501\" 1 100L --await --secret testnet_container_key.key --network testnet --blockchain my_rell_dapp_test_3
transaction with rid BCFD9565CA58A041F35E0C154535117EE3D6C6D15BA8A4B35D34AC2A7A5ABB08 was posted CONFIRMED
