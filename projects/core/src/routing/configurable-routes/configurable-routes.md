# Configurable routes

TODO: add table of contents

URL to every route in Storefront and Shell App can be configurable and translatable. This means that we don't have to hardcode URLs in templates and code anymore.

Instead of it, the translations of URLs can be defined in the Storefront's config. And configurable routes mechanism can be used in templates and the code to generate translated URLs based on given information:

- a unique name of route and params object, or
- an URL having a default shape

## Routes config

### Default config

The default routes config for Storefront's pages can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts).

```typescript
// defaut-storefront-routes-translations.ts
default: {
    /* ... */
    product: { 
        paths: ['product/:productCode'],
        /* ... */
    }
    /* ... */
}
```

#### SUBJECTS OF CHANGE
- default config is planned to be moved out from `@spartacus/core` and splitted in between the feature modules in `@spartacus/storefrontlib`


### Extending config

Every part of default config can be extended and overwritten in the Shell App, using `StorefrontModule.withConfig`:

1. for all languages (`default` key):
   
    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                default: {
                    product: { paths: ['p/:productCode'] }
                }
            }
        }
    })
    ```

    Then URL of product page will have shape `p/:productCode` in all languages 

2. for specific languages (for example `en` key):
   
    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                /* not overwritten: 
                default: {
                    product: { paths: ['p/:productCode'] }
                }
                */
                en: {
                    product: { paths: [':productCode/custom/product-path'] }
                }
            }
        }
    })
    ```

    Then URL of product page will have shape `:productCode/custom/product-path` only in English. But in every other language it will have the default shape (`product/:productCode`).

3. both for all languages (`default` key) and for specific languages (for example `en` key):

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                default: { // overwritten
                    product: { paths: ['p/:productCode'] }
                },
                en: {
                    product: { paths: [':productCode/custom/product-path'] }
                }
            }
        }
    })
    ```

    Then URL of product page will have shape `:productCode/custom/product-path` only in English. But in every other language it will have the (overwritten) default shape (`p/:productCode`).

#### Object extensibility rule:

- configured objects **extend** default objects
- configured values (primitives, arrays, `null`) **overwrite** default values

#### When configuring paths, use names of params from defaults

All params that appear in default URLs (for example `:productCode` in path `'product/:productCode'`) mustn't be omitted in overwritten paths, because Storefront's components depend strictly on those essential params.

#### SUBJECTS OF CHANGE

- There are plans to support all languages. Only English is supported for now - keys: `en` and `default`.


## Navigation links

Navigation links can be automatically generated using `cxTranslateUrl` pipe. It can:

1. transform a unique name of a route into a configured URL: 
    ```typescript
    { route: <route> } | cxTranslateUrl
    ```

    Example:

    ```html
    <a [routerLink]="{ route: [ { name: 'product', params: { productCode: 1234 } } ] } | cxTranslateUrl"`></a>
    ```

    where config is:
    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                en: {
                    product: { paths: [':productCode/custom/product-path'] }
                }
            }
        }
    })
    ```

    result:

    ```html
    <a [routerLink]="['', 1234, 'custom', 'product-path']"></a>
    ```

    #### What if `{ route: <route> }` cannot be translated?

    When URL cannot be translated from `{ route: <unknown-route> }` (for example due to typo in the route's name, mising necessary params or wrong config) *the root URL* `['/']` is returned:
    ```html
    <a [routerLink]="{ route: <unknown-route> } | cxTranslateUrl"`></a>
    ```

    result:
    ```html
    <a [routerLink]="['/']"></a>
    ```


2. transform an URL having a default shape into a configured URL: 
    ```typescript
    { url: <url> } | cxTranslateUrl
    ```

    Examples:

    1. When default shape of URL **is not overwritten**

        ```html
        <a [routerLink]="{ url: 'product/1234' } | cxTranslateUrl"`></a> 
        ```

        config:

        ```typescript
        StorefrontModule.withConfig({
            routesConfig: {
                translations: {
                    /* 
                    default: {
                        product: { paths: ['product/:productCode'] } // not overwritten
                    }
                    */
                    en: {
                        product: { paths: [':productCode/custom/product-path'] }
                    }
                }
            }
        })
        ```

        result:

        ```html
        <a [routerLink]="['', 1234, 'custom', 'product-path']"></a>
        ```

    2. When default shape of URL **is overwritten**

        ```html
        <a [routerLink]="{ url: 'p/1234' } | cxTranslateUrl"`></a>
        ```
        
        config:

        ```typescript
        StorefrontModule.withConfig({
            routesConfig: {
                translations: {
                    default: {
                        product: { paths: ['p/:productCode'] } /* overwritten */
                    },
                    en: {
                        product: { paths: [':productCode/custom/product-path'] }
                    }
                }
            }
        })
        ```

        result:

        ```html
        <a [routerLink]="['', 1234, 'custom', 'product-path']"></a>
        ```


    #### What if `{ url: <url> }` cannot be translated?

    When URL cannot be translated from `{ url: <unknown-url> }` (for example due to unexpected shape of URL, or wrong config) *the original URL* is returned:

    ```html
    <a [routerLink]="{ url: '/unknown/url' } | cxTranslateUrl"`></a> 
    ```

    result:
    
    ```html
    <a [routerLink]="'/unknown/url'"></a>
    ```


## Routes

Angular's `Routes` need to contain a unique route name at property `data.cxPath` in order to be configurable and translatable. For example:

```typescript
const routes: Routes = [
    {
        /* cxPath: 'product' - is a unique route name that will be matched to routes translations */
        data: { cxPath: 'product' }

        /* path: null - the value will be replaced by the path from config (in application's bootstrap time) */
        path: null, 

        component: ProductPageComponent
        /* ... */
    }
];
```

#### SUBJECTS OF CHANGE:

- `cxPath` property is planned to be replaced by other property (not known now) containing a default route's config (which will be moved out from [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts) and splitted in between feature modules)
- `path` is planned to contain default path alias


#### FAQ:

> Why `path` can't be left `undefined`?

- Because Angular requires any defined `path` in compilation time.


---
## Additional params
More params can be added to configured URLs (for example for SEO purposes):

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: { 
                    paths: [
                        // :productCode is an obligatory param, as it's present in default url
                        // :productName is a new param
                        ':productCode/custom/product-path/:productName',
                    ] 
                }
            }
        }
    }
})
```

Then additional params are also needed in `{ route: <route> }` and `{ url: <url> }` (otherwise URLs cannot be translated). Examples:

1. `{ route: <route> }` needs also `productName` param:

    ```html
    <a [routerLink]="{ route: [ { name: 'product', params: { productName: 'ABC', productCode: 1234 } } ] } | cxTranslateUrl"`></a>
    ```

    result:

    ```html
    <a [routerLink]="['', 1234, 'custom', 'product-path', 'ABC']"></a>
    ```

2. `{ url: <url> }` needs also `productName` param. And default translations in config need `:productName` too. For example:

    ```html
    <a [routerLink]="{ url: 'product/1234/ABC' } | cxTranslateUrl"></a> 
    ```

    where config is:

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                default: {
                    product: { 
                        paths: ['product/:productCode/:productName'] 
                    }
                }
                en: {
                    product: { 
                        paths: [
                            // :productCode is an obligatory param
                            // :productName is a new param
                            ':productCode/custom/product-path/:productName',
                        ] 
                    }
                }
            }
        }
    })
    ```

    result:

    ```html
    <a [routerLink]="['', 1234, 'custom', 'product-path', 'ABC']"></a>
    ```

### Params mapping

For extensibility purposes, it's a good idea to pass a big domain object (for example object with product details) with many unnecessary properties into params of `{ route: [{params: <params>, ...}] }`. Then the values from this object can be displayed in the in URL, if configured. But sometimes the names of object's properties don't match exactly to names of URL params in translations. Thanks to `paramsMapping`, they can be mapped. For example:

Suppose there is an object `productDetails === { name: 'ABC', ... }`.

```html
<a [routerLink]="{ route: [ { name: 'product', params: productDetails ] | cxTranslateUrl"`></a>
```

and config is

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            default: {
                product: {
                    /* object's 'name' property will be mapped to path's 'productName' param */
                    paramsMapping: { productName: 'name' }
                }
            }
            en: {
                product: { paths: ['/p/:productCode/:productName'] },
            }
        }
    }
})
```

result:

```html
<a [routerLink]="['', 1234, 'custom', 'product-path']"></a>
```

#### Use `default` key for `paramsMapping`

Not to repeat `paramsMapping` for every language key, it should be defined under `default` key.

#### Default params maping

Some Storefront's routes have already predefined default `paramsMapping`. They can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts)

##### SUBJECTS OF CHANGE:

- default `paramsMappings` are planned to be moved out from `@spartacus/core` and splitted in between the feature modules in `@spartacus/storefrontlib`


## Disabling routes
To disable a route (to remove it from Angular's router config and avoid translating URLs to this route) it suffices to do one of those things in the config:
- set `null` for this route's name
- set `null` or `[]` for route's paths

Example:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: null,
                /*
                or
                  product: { paths: null }
                or
                  product: { paths: [] }
                */
            }
        }
    }
})
```

- `{ route: <route>} `

    ```html
    <a [routerLink]="{ route: [ { name: 'product', params: { productCode: 1234 } } ] } | cxTranslateUrl"`></a>
    ```

    result

    ```html
    <a [routerLink]="['/']"></a>
    ```

- `{ url: <url>} `

    ```html
    <a [routerLink]="{ url: 'product/1234' } | cxTranslateUrl"`></a> 
    ```

    result 

    ```html
    <a [routerLink]="'product/1234'"></a>
    ```

---



### Plans

### Work in progress:

More ways to extend default routes translations config can be found under this link.
> SPIKE TODO: write doc and add link here

### Whe can pass to links whole entity


### Params mapping


### Overriding default URLs
TODO: describe how it populates to all languages and how it changes behaviour of default URLs recognition

### 'path' and 'route' could not be both


### Path aliases
When more than one path is configured for specific route name, then relevant `Route` object will be multiplied and each `Route` copy will have one `path` from configured `paths` list.