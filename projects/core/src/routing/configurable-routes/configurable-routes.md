# Configurable routes

TODO: add table of contents

URL to every route in Storefront and Shell App can be configurable and translatable. This means that we don't have to hardcode URLs anymore in:

- `path` and `redirectTo` properties of routes
- directives `routerLink` in HTML templates
- invocations of `Router.navigate` method in Typescript code

Instead of it, URLs will be defined only in the Storefront's config under unique route names. And everywhere else only those unique route names will be used.

## Config

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

Default config can be extended in the Shell App, using `StorefrontModule.withConfig`:

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

#### SUBJECTS OF CHANGE

- There are plans to support all languages. For now only English is supported (`default` and `en` keys).

#### Don't modify obligatory names of params

Names of params (for example `:productCode`) that appear in default URLs (for example `product/:productCode`) should not be omitted nor changed in configured URLs, because implementation of Storefront's components depend on the names of necessary route's params.


## Navigation links

Navigation links can be automatically generated using `cxTranslateUrl` pipe. It can:

1. transform unique route's name into configured URL: 
    ```typescript
    { route: <route> } | cxTranslateUrl
    ```

2. transform URL of default shape into configured URL: 
    ```typescript
    { url: <url> } | cxTranslateUrl
    ```


#### Examples:

1. Translate `{ route: <route> }` 

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

2. Translate `{ url: <url> }`

    a) When not overwritten default URL shape

    ```html
    <a [routerLink]="{ url: 'product/1234' } | cxTranslateUrl"`></a> 
    ```

    config's default URL **is not overwritten**:

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

    b) When overwritten default URL shape

    ```html
    <a [routerLink]="{ url: 'p/1234' } | cxTranslateUrl"`></a>
    ```
    
    config's default URL **is overwritten**:

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

- `path` is planned to contain single default path
- `cxPath` property is planned to be replaced by other property (not known now) containing whole default config of the route (which will be moved out from [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts))

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

Than it has to be handled properly for `{ route: <route> }` and `{ url: <url> }` options:

1. `{ route: <route> }` has to contain also `productName` param. For example:

    ```html
    <a [routerLink]="{ route: [ { name: 'product', params: { productName: 'ABC', productCode: 1234 } } ] } | cxTranslateUrl"`></a>
    ```

    result:

    ```html
    <a [routerLink]="['', 1234, 'custom', 'product-path', 'ABC']"></a>
    ```

    Otherwise url cannot be translated.

2. `{ url: <url> }` has to contain also `productName` param. And default translations have to contain `:productName` too. For example:

    ```html
    <a [routerLink]="{ url: 'product/1234/ABC' } | cxTranslateUrl"`></a> 
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


    Otherwise url cannot be translated.

### Params mapping

For extensibility it's good to pass a big domain object (for example object with product details) with many unnecessary properties as params object to `{ route: [{params: <params>, ...}] }`. Then we can eaisly use values from this domain object in URL. But sometimes names of necessary properties don't match exactly to names of URL params. Thanks to `paramsMapping`, they can be mapped. For example:

```html
<a [routerLink]="{ route: [ { name: 'product', params: productDetails ] | cxTranslateUrl"`></a>
```

where

```typescript
productDetails === { name: 'ABC', /* ... */ }
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

#### Default params maping

Some Storefront's routes have already predefined default `paramsMapping`. It can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts)

##### SUBJECTS OF CHANGE:

- default `paramsMappings` are planned to be moved out from `@spartacus/core` and splitted in between the feature modules in `@spartacus/storefrontlib`


#### Use `default` key for `paramsMapping`

    Not to repeat `paramsMapping` in every language, they should be defined once under `default` key

!!! Names of params in default URLs should not be changed, because they are hardcoded used in components. So please don't do:
```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            default: {
                product: {
                    paramsMapping: { customProductCodeParam: 'code' }
                }
            },
            en: {
                product: { paths: ['product/:customProductCodeParam'] } // dont replace standard :productCode param name
            }
        }
    }
})
```

## Disabling routes
To disable a route (to remove it from Angular's router config and prevent generating links to this route) it suffices to set `null` for it's unique name in the config:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: null // `product` is a unique name of the route
            }
        }
    }
})
```
```html
<!-- `product` is a unique name of the route -->
<a [routerLink]="{ route: [ { name: 'product', params: { productCode: 1234 } } ] } | cxTranslateUrl"`></a>

<!-- result -->
<a href="/"></a>
```
```html
<!-- `/product/1234' === cmsData.url -->
<a [routerLink]="{ url: cmsData.url } | cxTranslateUrl"`></a> 

<!-- result -->
<a href="/"></a>
```

### Current limitations

- only english (`en`) translations are used


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