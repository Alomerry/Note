package copier

import (
	"fmt"
	"reflect"
	"time"
)

const (

	RFC3339Mili = "2006-01-02T15:04:05.999Z07:00"

	MAX_INT64 int64 = 9223372036854775807
	MAX_INT   int   = 4294967295
)

// the function which will automatically convert value
type converter func(reflect.Value) reflect.Value

type loader func(interface{}, reflect.Value, map[string]interface{}, map[string]string)

type transformer func(interface{}, interface{}, map[string]interface{}, map[string]string)

func genLoader(converters ...converter) loader {
	return func(origin interface{}, targetValue reflect.Value, resetFieldMethods map[string]interface{}, diffFields map[string]string) {
		originValue := reflect.ValueOf(origin)
		if originValue.Type().Kind() == reflect.Ptr {
			originValue = originValue.Elem()
		}

		if targetValue.Type().Kind() == reflect.Ptr {
			targetValue = targetValue.Elem()
		}

		originType := originValue.Type()

		targetType := targetValue.Type()

		for i := 0; i < originType.NumField(); i++ {
			originField := originType.Field(i)
			fieldName := originField.Name
			value := originValue.Field(i)
			if method, ok := resetFieldMethods[fieldName]; ok {
				f := reflect.ValueOf(method)
				result := f.Call(
					[]reflect.Value{value},
				)
				value = result[0]
			}

			if newFiledName, ok := diffFields[fieldName]; ok {
				fieldName = newFiledName
			}

			if targetField, ok := targetType.FieldByName(fieldName); ok {
				if len(converters) > 0 {
					_, hasResetFieldMethod := resetFieldMethods[fieldName]

					if !hasResetFieldMethod {
						if targetField.Type != value.Type() {
							for _, convert := range converters {
								value = convert(value)
							}
						}
					}
				}

				if value.Type().ConvertibleTo(targetField.Type) {
					value = value.Convert(targetField.Type)
					targetValue.FieldByName(fieldName).Set(value)
				}
			}
		}
	}
}

// genExistLoader only copy the fields in origin
// attention: if the origin field has a bool type and the value is false, this field will not be copied
func genOverwriteLoader(converters ...converter) loader {
	return func(origin interface{}, targetValue reflect.Value, resetFieldMethods map[string]interface{}, diffFields map[string]string) {
		originValue := reflect.ValueOf(origin)
		if originValue.Type().Kind() == reflect.Ptr {
			originValue = originValue.Elem()
		}

		if targetValue.Type().Kind() == reflect.Ptr {
			targetValue = targetValue.Elem()
		}

		originType := originValue.Type()

		targetType := targetValue.Type()

		for i := 0; i < originType.NumField(); i++ {
			originField := originType.Field(i)
			fieldName := originField.Name
			value := originValue.Field(i)
			// 判断为空则跳过拷贝，bool 类型需要重新判断
			if IsZero(value.Interface()) && reflect.ValueOf(value.Interface()).Kind() != reflect.Bool {
				continue
			}
			if method, ok := resetFieldMethods[fieldName]; ok {
				f := reflect.ValueOf(method)
				result := f.Call(
					[]reflect.Value{value},
				)
				value = result[0]
			}

			if newFiledName, ok := diffFields[fieldName]; ok {
				fieldName = newFiledName
			}

			if targetField, ok := targetType.FieldByName(fieldName); ok {
				if len(converters) > 0 {
					_, hasResetFieldMethod := resetFieldMethods[fieldName]

					if !hasResetFieldMethod {
						for _, convert := range converters {
							value = convert(value)
						}
					}
				}

				if value.Type().ConvertibleTo(targetField.Type) {
					value = value.Convert(targetField.Type)
					targetValue.FieldByName(fieldName).Set(value)
				}
			}
		}
	}
}

// genGetterLoader
//
// fieldsMapper 表示 target 中的字段应该访问 origin 的字段
// getFieldMethods 表示取值方法，形参是 origin 中的字段
func genGetterLoader(converters ...converter) loader {
	return func(origin interface{}, targetValue reflect.Value, getFieldMethods map[string]interface{}, fieldsMapper map[string]string) {
		originValue := reflect.ValueOf(origin)
		if originValue.Type().Kind() == reflect.Ptr {
			originValue = originValue.Elem()
		}

		if targetValue.Type().Kind() == reflect.Ptr {
			targetValue = targetValue.Elem()
		}

		originType := originValue.Type()

		targetType := targetValue.Type()

		// 列举 target 字段
		for i := 0; i < targetType.NumField(); i++ {
			targetField := targetType.Field(i)
			fieldName := targetField.Name
			value := reflect.Value{}
			if originFieldName, ok := fieldsMapper[fieldName]; ok {
				if method, ok := getFieldMethods[fieldName]; ok {
					value = originValue.FieldByName(originFieldName)
					f := reflect.ValueOf(method)
					result := f.Call(
						[]reflect.Value{value},
					)
					value = result[0]
					targetValue.FieldByName(fieldName).Set(value.Convert(targetField.Type))
					continue
				} else {
					panic(fmt.Sprintf("can't find getFieldMethod:[%v]", fieldName))
				}
			}

			if originField, ok := originType.FieldByName(fieldName); ok {
				value = originValue.FieldByName(fieldName)
				if len(converters) > 0 {
					for _, convert := range converters {
						value = convert(value)
					}
				}
				if originField.Type.ConvertibleTo(targetField.Type) {
					value = value.Convert(targetField.Type)
					targetValue.FieldByName(fieldName).Set(value)
				}
			}
		}
	}
}

func genWriteEmptyFieldsGetterLoader(converters ...converter) loader {
	return func(origin interface{}, targetValue reflect.Value, getFieldMethods map[string]interface{}, fieldsMapper map[string]string) {
		originValue := reflect.ValueOf(origin)
		if originValue.Type().Kind() == reflect.Ptr {
			originValue = originValue.Elem()
		}

		if targetValue.Type().Kind() == reflect.Ptr {
			targetValue = targetValue.Elem()
		}

		originType := originValue.Type()

		targetType := targetValue.Type()

		for i := 0; i < targetType.NumField(); i++ {
			targetField := targetType.Field(i)
			fieldName := targetField.Name
			value := reflect.Value{}

			if !targetValue.Field(i).IsZero() {
				continue
			}

			if originFieldName, ok := fieldsMapper[fieldName]; ok {
				if method, ok := getFieldMethods[fieldName]; ok {
					value = originValue.FieldByName(originFieldName)
					f := reflect.ValueOf(method)
					result := f.Call(
						[]reflect.Value{value},
					)
					value = result[0]
					targetValue.FieldByName(fieldName).Set(value.Convert(targetField.Type))
					continue
				} else {
					panic(fmt.Sprintf("can't find getFieldMethod:[%v]", fieldName))
				}
			}

			if _, ok := originType.FieldByName(fieldName); ok {
				value = originValue.FieldByName(fieldName)
				if len(converters) > 0 {
					for _, convert := range converters {
						value = convert(value)
					}
				}
				if value.Type().ConvertibleTo(targetField.Type) {
					value = value.Convert(targetField.Type)
					targetValue.FieldByName(fieldName).Set(value)
				}
			}
		}
	}
}

func genOverWriteGetterLoader(converters ...converter) loader {
	return func(origin interface{}, targetValue reflect.Value, getFieldMethods map[string]interface{}, fieldsMapper map[string]string) {
		originValue := reflect.ValueOf(origin)
		if originValue.Type().Kind() == reflect.Ptr {
			originValue = originValue.Elem()
		}

		if targetValue.Type().Kind() == reflect.Ptr {
			targetValue = targetValue.Elem()
		}

		originType := originValue.Type()

		targetType := targetValue.Type()

		for i := 0; i < targetType.NumField(); i++ {
			targetField := targetType.Field(i)
			fieldName := targetField.Name
			value := reflect.Value{}

			if originValue.FieldByName(fieldName).IsZero() {
				continue
			}

			if originFieldName, ok := fieldsMapper[fieldName]; ok {
				if method, ok := getFieldMethods[fieldName]; ok {
					value = originValue.FieldByName(originFieldName)
					f := reflect.ValueOf(method)
					result := f.Call(
						[]reflect.Value{value},
					)
					value = result[0]
					targetValue.FieldByName(fieldName).Set(value.Convert(targetField.Type))
					continue
				} else {
					panic(fmt.Sprintf("can't find getFieldMethod:[%v]", fieldName))
				}
			}

			if _, ok := originType.FieldByName(fieldName); ok {
				value = originValue.FieldByName(fieldName)
				if len(converters) > 0 {
					for _, convert := range converters {
						value = convert(value)
					}
				}
				if value.Type().ConvertibleTo(targetField.Type) {
					value = value.Convert(targetField.Type)
					targetValue.FieldByName(fieldName).Set(value)
				}
			}
		}
	}
}

func genTransformer(load loader) transformer {
	return func(origin, target interface{}, resetFieldMethods map[string]interface{}, diffFields map[string]string) {
		if reflect.Slice != reflect.TypeOf(origin).Kind() {
			load(origin, reflect.ValueOf(target).Elem(), resetFieldMethods, diffFields)
		} else {
			originValue := reflect.ValueOf(origin)
			length := originValue.Len()
			newSlice := reflect.MakeSlice(reflect.TypeOf(target).Elem(), length, length)
			targetSliceValue := reflect.ValueOf(target).Elem()
			targetSliceValue.Set(newSlice)
			for i := 0; i < length; i++ {
				value := targetSliceValue.Index(i)
				// If the type of the value is a pointer, nil cannot be set directly
				// We set a zero value for it first
				if value.Kind() == reflect.Ptr {
					basicTargetType := value.Type().Elem()
					zeroValue := reflect.New(basicTargetType)
					value.Set(zeroValue)
				}

				load(originValue.Index(i).Interface(), value, resetFieldMethods, diffFields)
			}
		}
	}
}

// Note that type of time.Time and bson.ObjectId will automatically convert to int64 and string.
func getAutomaticConvertValue(value reflect.Value) reflect.Value {
	if timeValue, ok := value.Interface().(time.Time); ok {
		if timeValue.Unix() > 0 {
			return reflect.ValueOf(timeValue.Unix())
		} else {
			return reflect.ValueOf(int64(0))
		}
	}

	return value
}

// similar to getAutomaticConvertValue, but it will convert time to RFC3339
func getAutomaticConvertValueRFC3339(value reflect.Value) reflect.Value {
	if timeValue, ok := value.Interface().(time.Time); ok {
		if timeValue.Unix() > 0 {
			return reflect.ValueOf(timeValue.Format(RFC3339Mili))
		} else {
			return reflect.ValueOf("")
		}
	}

	return value
}

var loadProtoBuf = genLoader(getAutomaticConvertValue)
var loadProtoBufRFC3339 = genLoader(getAutomaticConvertValueRFC3339)
var load = genLoader()

var TransformExistFields = genTransformer(loadProtoBufOverwrite)
var loadProtoBufOverwrite = genOverwriteLoader(getAutomaticConvertValue)

// todo @alomerry wu fieldsMapper添加支持数组
var TransformFieldsByGetter = genTransformer(loadProtoBufGetter)

// todo @alomerry wu 转换器可传参
var loadProtoBufGetter = genGetterLoader(getAutomaticConvertValue)

var TransformExistFieldsByGetter = genTransformer(loadProtoBufWriteEmptyFieldsGetter)
var loadProtoBufWriteEmptyFieldsGetter = genWriteEmptyFieldsGetterLoader(getAutomaticConvertValueRFC3339)

// Enhanced CopyFields(origin, target interface{})
// Support to change the field name and reset field value through a custom function.
// resetFieldMethods, the key is the field name, value is reset function.
// Note that type of time.Time and bson.ObjectId will automatically convert.
// diffFields, the key is old field name. value is new filed name.
var TransformFields = genTransformer(loadProtoBuf)
var TransformFieldsRFC3339 = genTransformer(loadProtoBufRFC3339)

// Similar to TransformFields, but this function will not automatically
// convert values
var TransformFieldsWithoutAutoConvertion = genTransformer(load)

// Copy origin value and stores the result in the value pointed to by target.
// Origin can be slice or struct.
// Target must be a pointer, and not equal to nil.
func CopyFields(origin, target interface{}) {
	TransformFields(origin, target, map[string]interface{}{}, map[string]string{})
}

func CopyFieldsRFC3339(origin, target interface{}) {
	TransformFieldsRFC3339(origin, target, map[string]interface{}{}, map[string]string{})
}

// This function is written for struct, all the target and origins are
// supporsed to be struct.
func CopyFieldsWithoutConvert(origin, target interface{}) {
	TransformFieldsWithoutAutoConvertion(origin, target, map[string]interface{}{}, map[string]string{})
}

// judge whether the params is zero value
func IsZero(any interface{}) bool {
	v := reflect.ValueOf(any)
	return IsEmpty(v)
}

func IsEmpty(v reflect.Value) bool {
	if !v.IsValid() {
		return true
	}

	switch v.Kind() {
	case reflect.Array, reflect.Map, reflect.Slice, reflect.String:
		return v.Len() == 0
	case reflect.Bool:
		return !v.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return v.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return v.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return v.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return v.IsNil()
	}

	return reflect.DeepEqual(v.Interface(), reflect.Zero(v.Type()).Interface())
}
