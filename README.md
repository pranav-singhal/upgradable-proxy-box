# Upgradable-Proxy-Box

This box comes with everything you need to build upgradable-proxy contracts. We also 
have a simple react-app shipped along with it that you can use to see
how __you can update a contract without losing any data__.

## Installation

First ensure that you are in an empty repository.
1. Run the `unbox` command using truffle
```bash
truffle unbox pranav-singhal/upgradable-proxy-box
```
2. Run the development console
```bash
truffle dev
```
 OR
 ```bash
truffle develop
```
3. In the console now open run the `compile` and `migrate` 

```js
compile // compile the contracts
```
```js
migrate // migrate the contracts
```
This will compile and migrate your contracts. It will also create the ABIs and put them inside the `app` folder
 
4. Go into your `app` folder and `yarn install` the react app

```bash
cd app
yarn install
```

5. In the same folder, `yarn start ` the react app

```bash
yarn start
```
 

