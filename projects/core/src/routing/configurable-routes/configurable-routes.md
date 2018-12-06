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
- There are plans to move default config from `@spartacus/core` and split it between the page modules in `@spartacus/storefrontlib`


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
    <a [routerLink]="[1234, 'custom', 'product-path']"></a>
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
    <a [routerLink]="[1234, 'custom', 'product-path']"></a>
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
    <a [routerLink]="[1234, 'custom', 'product-path']"></a>
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

Angular's `Routes` need to contain unique route name under property `data.cxPath` in order to be configurable and translatable. For example:

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

When more than one path is configured for specific route name, then its `Route` object will copied (in application's bootstrap time) and each copy will have one path from list of configured path aliases.

#### SUBJECTS OF CHANGE:

- `path` is planned to contain single default path
- `cxPath` property is planned to be replaced by other property (not known now) containing whole default config of the route (which will be moved out from [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts))

#### FAQ:

> Why `path` can't be left `undefined`?

- Because Angular requires any defined `path` in compilation time.


---
## Additional params in URL
More params can be configured for URLs (for example for SEO purposes):

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                // `product` key is a unique name of the route
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


```html
<!-- `product` is a unique name of the route -->
<a [routerLink]="{ route: [ { name: 'product', params: { productCode: 1234 } } ] } | cxTranslateUrl"`></a>

<!-- result -->
<a href="1234/custom/product-path"></a>
```

### Additional params in URL vs. URL of default shape

- If URL coming from CMS doesn't contain `:productName` param, an alias without `:productName` param has to be configured too (otherwise URL from CMS will be translated to `/`):

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                en: {
                    // `product` key is a unique name of the route
                    product: { 
                        paths: [
                            // :productCode is an obligatory param
                            // :productName is a new param
                            ':productCode/custom/product-path/:productName',
                            ':productCode/custom/product-path',
                        ] 
                    }
                }
            }
        }
    })
    ```

    ```html
    <!-- `/product/1234' === cmsData.url -->
    <a [routerLink]="{ url: cmsData.url } | cxTranslateUrl"`></a> 

    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```

- However, if URL coming from CMS actually **does contain** a non-default `:productName` param, it suffices to override default URLs in the config:

    ```typescript
    StorefrontModule.withConfig({
        routesConfig: {
            translations: {
                default: {
                    product: {
                        paths: ['product/:productCode/:productName']
                    }
                },
                en: {
                    product: { 
                        // :productCode is an obligatory param
                        // :productName is a new param
                        paths: [':productCode/custom/product-path/:productName'] 
                    }
                }
            }
        }
    })
    ```

    ```html
    <!-- '/product/1234/ABC' === cmsData.url -->
    <a [routerLink]="{ url: cmsData.url } | cxTranslateUrl"`></a> 

    <!-- result -->
    <a href="1234/custom/product-path/ABC"></a>
    ```

### Params mapping
A thick domain object can be passed to `cxTranslateUrl` as params instead of thin object with only obligatory params. However to translate properly the URL, the route params' names must match to names of properties in given object. Otherwise, we should configure default `paramsMapping`:
```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            default: {
                product: {
                    paramsMapping: { productCode: 'code' }
                }
            },
            en: {
                product: { paths: [':productCode/custom/product-path'] }
            }
        }
    }
})
```

**Note:** Default params mapping can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts).

```html
<!-- 
    productObject === {
        code: 1234,
        name: 'ABC'
        images: {...},
        price: {...}
        ...
    }
    -->
<a [routerLink]="['product'] | cxTranslateUrl: [productObject]"`></a>

<!-- result -->
<a href="1234/custom/product-path"></a>
```

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