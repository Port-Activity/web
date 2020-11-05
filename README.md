# SPIA Web

Site build with ReactJS.

## Developing

```
cp .env.sample .env
```

Edit .env if required.

```
yarn install
yarn start
```

## Troubleshooting

There is known problem with yarn install. If you get error message like:
```
...
fsevents-handler.js:28
  return (new fsevents(path)).on('fsevent', callback).start();
          ^

TypeError: fsevents is not a constructor
...
```

Try installing with npm:
```
npm install
```

## Misc k8s commands
To get external ip for ingress:
```
kubectl get ing -n spia-staging -o wide
```
