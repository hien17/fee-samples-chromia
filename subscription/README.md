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


